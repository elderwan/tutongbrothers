import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";
import type { MainComment, ReplyComment, CommentsResponse } from "@/types";

export interface CreatePostData {
    title?: string;
    content: string;
    images?: string[];
    mentions?: string[];
}

export interface Post {
    _id: string;
    title?: string;
    content: string;
    userId: string;
    userName: string;
    userImg: string;
    images: string[];
    likes: string[];
    mentions: string[];
    views: number;
    createdAt: string;
    updatedAt: string;
}

export const createPostApi = async (data: CreatePostData): Promise<ApiResponse<{ post: Post }>> => {
    return await api.post(`${BASE_URL}/posts`, data);
};

export const getPostsApi = async (page = 1, limit = 20): Promise<ApiResponse<{ posts: Post[]; pagination: any }>> => {
    return await api.get(`${BASE_URL}/posts?page=${page}&limit=${limit}`);
};

export const getPostByIdApi = async (id: string): Promise<ApiResponse<{ post: Post }>> => {
    return await api.get(`${BASE_URL}/posts/${id}`);
};

export const deletePostApi = async (id: string): Promise<ApiResponse<{}>> => {
    return await api.del(`${BASE_URL}/posts/${id}`);
};

export const likePostApi = async (id: string): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> => {
    return await api.post(`${BASE_URL}/posts/${id}/like`, {});
};

export const getUserPostsApi = async (userId: string, page = 1, limit = 20): Promise<ApiResponse<{ posts: Post[]; pagination: any }>> => {
    return await api.get(`${BASE_URL}/posts/user/${userId}?page=${page}&limit=${limit}`);
};

// Post Comment APIs
export const getPostComments = async (
    postId: string,
    page: number = 1,
    limit: number = 10
): Promise<ApiResponse<CommentsResponse>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return await api.get(`${BASE_URL}/comments/post/${postId}?${params}`);
};

export const getPostCommentsCount = async (
    postId: string,
): Promise<ApiResponse<{ total: number; mainComments: number; replyComments: number }>> => {
    return await api.get(`${BASE_URL}/comments/post/countComments/${postId}`);
};

export const addMainCommentToPost = async (
    postId: string,
    comment: { content: string }
): Promise<ApiResponse<MainComment>> => {
    return await api.post(`${BASE_URL}/comments/post/${postId}/main`, comment);
};

export const addReplyCommentToPost = async (
    parentId: string,
    reply: { receiveUserId: string; content: string }
): Promise<ApiResponse<ReplyComment>> => {
    return await api.post(`${BASE_URL}/comments/post/main/${parentId}/reply`, reply);
};

export const deleteMainCommentFromPost = async (commentId: string): Promise<ApiResponse<{}>> => {
    return await api.del(`${BASE_URL}/comments/post/main/${commentId}`);
};

export const deleteReplyCommentFromPost = async (replyId: string): Promise<ApiResponse<{}>> => {
    return await api.del(`${BASE_URL}/comments/post/reply/${replyId}`);
};
