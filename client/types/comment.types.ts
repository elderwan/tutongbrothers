/**
 * 评论相关的类型定义
 * Comment-related type definitions
 */

/**
 * 回复评论
 */
export interface ReplyComment {
    _id: string;
    parentId: string; // 主评论ID
    blogId: string;
    senderId: string;
    senderName: string;
    senderImg: string;
    receiverId: string;
    receiverName: string;
    receiverImg: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * 主评论
 */
export interface MainComment {
    _id: string;
    blogId: string;
    userId: string;
    userName: string;
    userImg: string;
    content: string;
    replies: ReplyComment[];
    createdAt: string;
    updatedAt: string;
}

/**
 * 通用评论项（用于列表展示）
 */
export interface CommentItem {
    _id: string;
    userId: string;
    userName: string;
    userImg: string;
    content: string;
    parentId?: string;
    replies?: CommentItem[];
    createdAt: string;
}

/**
 * 评论列表响应
 */
export interface CommentsResponse {
    comments: MainComment[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

/**
 * 添加主评论请求
 */
export interface AddMainCommentRequest {
    blogId: string;
    content: string;
}

/**
 * 添加回复评论请求
 */
export interface AddReplyCommentRequest {
    parentId: string; // 主评论ID
    blogId: string;
    receiverId: string;
    content: string;
}
