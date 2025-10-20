/**
 * 技术栈相关的类型定义
 * Tech stack related type definitions
 */

/**
 * 技术项
 */
export interface TechItem {
    _id: string;
    name: string;
    icon: string;
    category: string;
    level?: number;
    description?: string;
}

/**
 * 技术分类
 */
export interface TechCategory {
    name: string;
    items: TechItem[];
}

/**
 * 技术栈列表响应
 */
export interface TechStackResponse {
    techStacks: TechItem[];
    categories: TechCategory[];
}
