import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";
import type {
    MainComment,
    ReplyComment,
    CommentsResponse,
    AddMainCommentRequest,
    AddReplyCommentRequest
} from "@/types";

// 重新导出类型供向后兼容
export type { MainComment, ReplyComment, CommentsResponse };

// 获取博客的所有评论
export async function getBlogComments(
    blogId: string,
    page: number = 1,
    limit: number = 10
): Promise<ApiResponse<CommentsResponse>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return await api.get(`${BASE_URL}/comments/blog/${blogId}?${params}`);
}
// get comment counts
export async function getBlogCommentsCount(
    blogId: string,
): Promise<ApiResponse<CommentsResponse>> {
    return await api.get(`${BASE_URL}/comments/blog/countComments/${blogId}`);
}

// 添加主评论
export async function addMainComment(
    blogId: string,
    comment: { userId: string; content: string }
): Promise<ApiResponse<MainComment>> {
    return await api.post(`${BASE_URL}/comments/blog/${blogId}/main`, comment);
}

// 添加回复评论
export async function addReplyComment(
    parentId: string,
    reply: { sendUserId: string; receiveUserId: string; content: string }
): Promise<ApiResponse<ReplyComment>> {
    return await api.post(`${BASE_URL}/comments/main/${parentId}/reply`, reply);
}

// 删除主评论
export async function deleteMainComment(commentId: string): Promise<ApiResponse<void>> {
    return await api.del(`${BASE_URL}/comments/main/${commentId}`);
}

// 删除回复评论
export async function deleteReplyComment(replyId: string): Promise<ApiResponse<void>> {
    return await api.del(`${BASE_URL}/comments/reply/${replyId}`);
}