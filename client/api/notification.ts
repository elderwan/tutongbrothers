import { BASE_URL } from "@/next.config"
import { ApiResponse } from "@/lib/Response"
import { api } from "@/lib/ApiFetch"

export interface NotificationItem {
  _id: string
  type: "reply" | "follow" | "new_blog"
  senderId: string
  receiverId: string
  blogId?: string
  mainCommentId?: string
  replyCommentId?: string
  isRead: boolean
  message?: string
  createdAt: string
  // 附加字段：后端增强的回复通知内容与删除状态
  commentContent?: string
  commentDeleted?: boolean
}

export interface NotificationListResp {
  items: NotificationItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export async function getNotifications(page = 1, limit = 20): Promise<ApiResponse<NotificationListResp>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  return await api.get(`${BASE_URL}/notifications?${params.toString()}`)
}

export async function markNotificationRead(id: string): Promise<ApiResponse<NotificationItem>> {
  return await api.post(`${BASE_URL}/notifications/${id}/read`, {})
}

export async function markAllNotificationsRead(): Promise<ApiResponse<null>> {
  return await api.post(`${BASE_URL}/notifications/read-all`, {})
}