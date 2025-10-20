/**
 * 博客相关的类型定义
 * Blog-related type definitions
 */

/**
 * 博客作者信息（populated 后的用户信息）
 */
export interface BlogAuthor {
    _id: string;
    userName: string;
    userImg: string;
    userDesc?: string;
}

/**
 * 简化的评论项（避免循环依赖）
 */
export interface SimplifiedComment {
    _id: string;
    userId: string;
    userName: string;
    userImg: string;
    content: string;
    createdAt: string;
}

/**
 * 博客文章
 */
export interface Blog {
    _id: string;
    title: string;
    description: string;
    content: string;
    userId: string | BlogAuthor; // 可以是字符串 ID 或 populated 的用户对象
    userName: string;
    userImg: string;
    type: string;
    images: string[];
    likes: string[];
    comments: SimplifiedComment[];
    commentsCount?: number; // 评论总数（主评论 + 回复评论）
    createdAt: string;
    updatedAt: string;
    views?: number;
}/**
 * 博客列表响应
 */
export interface BlogListResponse {
    blogs: Blog[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

/**
 * 创建博客请求
 */
export interface CreateBlogRequest {
    title: string;
    description: string;
    content: string;
    type: string;
    images?: string[];
}

/**
 * 更新博客请求
 */
export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
    _id: string;
}
