import { Request, Response } from "express"
import mongoose from "mongoose"
import Notification from "../models/Notification"
import ApiResponse from "../utils/Response"

// 获取当前用户的通知列表
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id as string
    const { page = 1, limit = 20 } = req.query as any
    const skip = (Number(page) - 1) * Number(limit)

    // 添加缓存头（较短缓存，因为通知需要实时性）
    res.setHeader('Cache-Control', 'private, max-age=10'); // 10秒缓存

    // 关联主评论/回复评论的内容，用于前端展示被回复的评论文本
    const notifications = await Notification.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({ path: "mainCommentId", select: "content" })
      .populate({ path: "replyCommentId", select: "content" })
      .lean() // 使用 lean() 提高性能

    const total = await Notification.countDocuments({ receiverId: userId })

    const items = notifications.map((n: any) => {
      const doc = n
      let commentContent: string | undefined
      let commentDeleted = false
      // 回复通知：优先返回子评论内容，若不存在则认为已删除
      if (doc.type === "reply") {
        console.log("doc=>", doc)
        if ((doc.mainCommentId && typeof doc.mainCommentId === "object" && doc.mainCommentId.content)) {
          if (doc.replyCommentId?.content) {
            commentContent = doc.replyCommentId.content
          } else {
            commentContent = doc.mainCommentId.content
          }
        } else {
          // console.log("doc.MainCommentId=>", doc)
          commentDeleted = true
          commentContent = "this comment has been deleted"
        }
      }
      return { ...doc, commentContent, commentDeleted }
    })

    res.status(200).json(ApiResponse.success("Notifications", 200, {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }))
  } catch (error) {
    console.error(error)
    res.status(500).json(ApiResponse.internalError("Failed to get notifications"))
  }
}

// 标记单条通知为已读
export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id as string
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json(ApiResponse.badRequest("Invalid notification id"))
      return
    }

    const notif = await Notification.findOneAndUpdate(
      { _id: id, receiverId: userId },
      { $set: { isRead: true } },
      { new: true }
    )

    if (!notif) {
      res.status(404).json(ApiResponse.notFound("Notification not found"))
      return
    }

    res.status(200).json(ApiResponse.success("Notification marked as read", 200, notif))
  } catch (error) {
    console.error(error)
    res.status(500).json(ApiResponse.internalError("Failed to mark notification as read"))
  }
}

// 全部标记为已读
export const markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id as string
    await Notification.updateMany({ receiverId: userId, isRead: false }, { $set: { isRead: true } })
    res.status(200).json(ApiResponse.success("All notifications marked as read", 200, null))
  } catch (error) {
    console.error(error)
    res.status(500).json(ApiResponse.internalError("Failed to mark all notifications as read"))
  }
}