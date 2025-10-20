/**
 * 通知相关的类型定义
 * Notification-related type definitions
 */

/**
 * 通知类型枚举
 */
export enum NotificationType {
    LIKE = 'like',
    COMMENT = 'comment',
    FOLLOW = 'follow',
    REPLY = 'reply',
    SYSTEM = 'system'
}

/**
 * 通知项
 */
export interface NotificationItem {
    _id: string;
    userId: string; // 接收通知的用户ID
    senderId: string; // 发送通知的用户ID
    senderName: string;
    senderImg: string;
    type: NotificationType | string;
    blogId?: string;
    blogTitle?: string;
    commentId?: string;
    commentContent?: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * 通知列表响应
 */
export interface NotificationListResponse {
    notifications: NotificationItem[];
    unreadCount: number;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
