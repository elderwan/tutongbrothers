import { Request, Response } from "express";
import MainComment, { IMainComment } from "../models/MainComment";
import ReplyComment, { IReplyComment } from "../models/ReplyComment";
import User from "../models/User";
import Blog from "../models/Blog";
import ApiResponse from "../utils/Response";
import Notification from "../models/Notification";

// 添加主评论
export const addMainComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blogId } = req.params;
        const { userId, content } = req.body;

        if (!userId || !content) {
            res.status(400).json(ApiResponse.badRequest("User ID and content are required"));
            return;
        }

        // 查找用户信息
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        // 验证博客是否存在
        const blog = await Blog.findById(blogId);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        // 创建主评论
        const mainComment = new MainComment({
            blogId,
            userId,
            userName: user.userName,
            userImg: user.userImg,
            content
        });

        await mainComment.save();

        // 创建通知：回复给博主（主评论属于回复博主）
        if (blog.userId && blog.userId.toString() !== userId.toString()) {
            await Notification.create({
                type: "reply",
                senderId: user._id,
                receiverId: blog.userId as any,
                blogId: blog._id,
                mainCommentId: mainComment._id,
                isRead: false,
                message: `${user.userName} commented on your blog`
            });
        }

        // 通过 Socket.IO 推送新主评论事件
        const io = (req.app as any).get("io");
        if (io) {
            io.to(`blog:${blogId}`).emit("comment:new", { type: "main", data: mainComment });
        }

        res.status(200).json(ApiResponse.success("Main comment added successfully", 200, mainComment));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to add main comment"));
    }
};

// 添加回复评论
export const addReplyComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { parentId } = req.params;
        const { sendUserId, receiveUserId, content } = req.body;

        if (!sendUserId || !receiveUserId || !content) {
            res.status(400).json(ApiResponse.badRequest("Send user ID, receive user ID and content are required"));
            return;
        }

        // 查找发送者信息
        const sender = await User.findById(sendUserId);
        if (!sender) {
            res.status(404).json(ApiResponse.notFound("Sender not found"));
            return;
        }

        // 查找接收者信息
        const receiver = await User.findById(receiveUserId);
        if (!receiver) {
            res.status(404).json(ApiResponse.notFound("Receiver not found"));
            return;
        }

        // 验证主评论是否存在
        const mainComment = await MainComment.findById(parentId);
        if (!mainComment) {
            res.status(404).json(ApiResponse.notFound("Main comment not found"));
            return;
        }

        // 创建回复评论
        const replyComment = new ReplyComment({
            parentId,
            sendUserId,
            senderName: sender.userName,
            senderImg: sender.userImg,
            receiveUserId,
            receiverName: receiver.userName,
            receiverImg: receiver.userImg,
            content
        });

        await replyComment.save();

        // 创建通知：回复被@的用户
        if (receiveUserId.toString() !== sendUserId.toString()) {
            await Notification.create({
                type: "reply",
                senderId: sender._id,
                receiverId: receiver._id,
                mainCommentId: mainComment._id,
                replyCommentId: replyComment._id,
                isRead: false,
                message: `${sender.userName} replied to your comment`
            });
        }

        // 通过 Socket.IO 推送新回复事件（广播到对应博客房间）
        const io = (req.app as any).get("io");
        const blogId = mainComment.blogId?.toString();
        if (io && blogId) {
            io.to(`blog:${blogId}`).emit("comment:new", { type: "reply", data: replyComment });
        }

        res.status(200).json(ApiResponse.success("Reply comment added successfully", 200, replyComment));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to add reply comment"));
    }
};

// 获取博客的所有评论（主评论 + 回复评论）
export const getBlogComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { blogId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // 验证博客是否存在
        const blog = await Blog.findById(blogId);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        // 获取主评论（分页）
        const mainComments = await MainComment.find({ blogId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const allCommentIds = mainComments.map((comment) => comment._id);

        const allReplies = await ReplyComment.find({ parentId: { $in: allCommentIds } })
            .sort({ createdAt: -1 });

        // 收集所有需要查询的用户ID（主评论和回复评论）
        const userIds = new Set<string>();
        mainComments.forEach(comment => userIds.add(comment.userId.toString()));
        allReplies.forEach(reply => {
            userIds.add(reply.sendUserId.toString());
            userIds.add(reply.receiveUserId.toString());
        });

        // 批量查询所有用户信息
        const users = await User.find({ _id: { $in: Array.from(userIds) } });
        const userMap = new Map(users.map(user => [user.id.toString(), user]));

        // 组装回复评论，使用实时用户信息
        const repliesByParent: Record<string, any[]> = {};
        allReplies.forEach((reply) => {
            const parentId = reply.parentId.toString();
            const sender = userMap.get(reply.sendUserId.toString());
            const receiver = userMap.get(reply.receiveUserId.toString());

            if (!repliesByParent[parentId]) {
                repliesByParent[parentId] = [];
            }

            repliesByParent[parentId].push({
                ...reply.toObject(),
                // 使用实时用户信息覆盖
                senderName: sender?.userName || reply.senderName,
                senderImg: sender?.userImg || reply.senderImg,
                receiverName: receiver?.userName || reply.receiverName,
                receiverImg: receiver?.userImg || reply.receiverImg
            });
        });        // 组装主评论，使用实时用户信息
        const commentsWithReplies = mainComments.map((mainComment) => {
            const commentUser = userMap.get(mainComment.userId.toString());
            return {
                ...mainComment.toObject(),
                // 使用实时用户信息覆盖
                userName: commentUser?.userName || mainComment.userName,
                userImg: commentUser?.userImg || mainComment.userImg,
                replies: repliesByParent[mainComment.id.toString()] || []
            };
        });


        // 获取总数（所有主评论 + 所有回复评论）
        const totalMainComments = await MainComment.countDocuments({ blogId });
        const allMainCommentIds = await MainComment.find({ blogId }).select('_id');
        const totalReplies = await ReplyComment.countDocuments({
            parentId: { $in: allMainCommentIds.map(c => c._id) }
        });
        const total = totalMainComments + totalReplies;

        res.status(200).json(ApiResponse.success("Comments retrieved successfully", 200, {
            comments: commentsWithReplies,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get comments"));
    }
};

export const getBlogCommentsCount = async (req: Request, res: Response): Promise<void> => {

    try {
        const { blogId } = req.params;

        // 验证博客是否存在
        const blog = await Blog.findById(blogId);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        // 获取主评论总数
        const mainCommentsCount = await MainComment.countDocuments({ blogId });

        // 获取该博客下所有主评论的ID
        const mainComments = await MainComment.find({ blogId }).select('_id');
        const mainCommentIds = mainComments.map(comment => comment._id);

        // 获取这些主评论的所有回复总数
        const replyCommentsCount = await ReplyComment.countDocuments({
            parentId: { $in: mainCommentIds }
        });

        res.status(200).json(ApiResponse.success("Comments count retrieved successfully", 200, {
            mainCommentsCount,
            replyCommentsCount,
            total: mainCommentsCount + replyCommentsCount
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get comments count"));
    }
}

// 删除主评论（同时删除所有回复）
export const deleteMainComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id; // 从JWT获取用户ID

        // 查找主评论
        const mainComment = await MainComment.findById(commentId);
        if (!mainComment) {
            res.status(404).json(ApiResponse.notFound("Main comment not found"));
            return;
        }

        // 验证用户权限（只能删除自己的评论）
        if (mainComment.userId.toString() !== userId) {
            res.status(403).json(ApiResponse.forbidden("You can only delete your own comments"));
            return;
        }

        // 删除所有相关的回复评论
        await ReplyComment.deleteMany({ parentId: commentId });

        // 删除主评论
        await MainComment.findByIdAndDelete(commentId);
        // 不删除关联通知，保持通知记录以便前端显示“已删除”文案

        res.status(200).json(ApiResponse.success("Main comment and all replies deleted successfully", 200, null));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to delete main comment"));
    }
};

// 删除回复评论
export const deleteReplyComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { replyId } = req.params;
        const userId = req.user.id; // 从JWT获取用户ID

        // 查找回复评论
        const replyComment = await ReplyComment.findById(replyId);
        if (!replyComment) {
            res.status(404).json(ApiResponse.notFound("Reply comment not found"));
            return;
        }

        // 验证用户权限（只能删除自己的回复）
        if (replyComment.sendUserId.toString() !== userId) {
            res.status(403).json(ApiResponse.forbidden("You can only delete your own replies"));
            return;
        }

        // 删除回复评论
        await ReplyComment.findByIdAndDelete(replyId);

        // 不删除关联通知，保持通知记录以便前端显示“已删除”文案

        res.status(200).json(ApiResponse.success("Reply comment deleted successfully", 200, null));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to delete reply comment"));
    }
};