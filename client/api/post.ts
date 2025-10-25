import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";

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
    comments: any[];
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

export const commentPostApi = async (id: string, content: string, parentId?: string): Promise<ApiResponse<{ comment: any }>> => {
    return await api.post(`${BASE_URL}/posts/${id}/comment`, { content, parentId });
};

export const getUserPostsApi = async (userId: string, page = 1, limit = 20): Promise<ApiResponse<{ posts: Post[]; pagination: any }>> => {
    return await api.get(`${BASE_URL}/posts/user/${userId}?page=${page}&limit=${limit}`);
};
