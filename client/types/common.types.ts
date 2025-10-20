/**
 * 通用工具类型定义
 * Common utility type definitions
 */

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data: T;
}

/**
 * 分页参数
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
}

/**
 * 分页信息
 */
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

/**
 * 上传选项
 */
export interface UploadOptions {
    maxSizeMB?: number;
    quality?: number;
    folder?: string;
}

/**
 * 上传结果
 */
export interface UploadResult {
    success: boolean;
    url?: string;
    error?: string;
}

/**
 * 搜索参数
 */
export interface SearchParams {
    search?: string;
    type?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
}
