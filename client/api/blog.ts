import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";
import type { Blog, BlogListResponse, CreateBlogRequest, UpdateBlogRequest } from "@/types";

// 重新导出类型供向后兼容
export type { Blog, BlogAuthor } from "@/types";

// 获取博客列表
export async function getBlogs(
    search?: string,
    type?: string,
    sortBy?: string,
    page: number = 1,
    limit: number = 10,
    userId?: string
): Promise<ApiResponse<{ blogs: Blog[]; pagination: any }>> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (type) params.append("type", type);
    if (sortBy) params.append("sortBy", sortBy);
    if (userId) params.append("userId", userId);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return await api.get(`${BASE_URL}/blogs?${params}`);
}

// 获取指定用户的博客列表
export async function getBlogsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
): Promise<ApiResponse<{ blogs: Blog[]; pagination: any }>> {
    return await getBlogs(undefined, undefined, undefined, page, limit, userId);
}

// 获取博客类型列表
export async function getBlogTypes(): Promise<ApiResponse<string[]>> {
    return await api.get(`${BASE_URL}/blogs/types`);
}

// 根据ID获取博客
export async function getBlogById(id: string): Promise<ApiResponse<Blog>> {
    return await api.get<ApiResponse<Blog>>(`${BASE_URL}/blogs/${id}`);
}

// 增加博客浏览量
export async function incrementBlogViews(
    blogId: string,
    viewerId?: string
): Promise<ApiResponse<{ views: number; incremented: boolean }>> {
    return await api.post(`${BASE_URL}/blogs/${blogId}/view`, { viewerId });
}

// 创建博客
export async function createBlog(
    blog: Omit<Blog, "_id" | "createdAt" | "updatedAt" | "likes" | "comments">
): Promise<ApiResponse<Blog>> {
    return await api.post(`${BASE_URL}/blogs`, blog);
}

// 点赞博客
export async function likeBlog(
    blogId: string,
    userId: string
): Promise<ApiResponse<{ likesCount: number }>> {
    return await api.post(`${BASE_URL}/blogs/${blogId}/like`, { userId });
}

// 添加评论
export async function addComment(
    blogId: string,
    comment: { userId: string; content: string; parentId?: string }
): Promise<ApiResponse<Comment>> {
    return await api.post(`${BASE_URL}/blogs/${blogId}/comment`, comment);
}

// 新增：删除博客（仅作者且已登录）
export async function deleteBlog(blogId: string): Promise<ApiResponse<void>> {
    return await api.del(`${BASE_URL}/blogs/${blogId}`);
}