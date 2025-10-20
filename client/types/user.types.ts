/**
 * 用户相关的类型定义
 * User-related type definitions
 */

/**
 * 基础用户信息
 */
export interface User {
    id?: string;
    userEmail?: string;
    account?: string;
    userName?: string;
    userImg?: string;
    userBanner?: string;
    userCode?: number;
    userDesc?: string;
    followingCount?: number;
    followersCount?: number;
}

/**
 * 完整的用户资料信息
 */
export interface UserProfile extends User {
    createdAt?: string;
    updatedAt?: string;
}

/**
 * 更新用户资料请求
 */
export interface UpdateProfileRequest {
    userName?: string;
    userDesc?: string;
    userImg?: string;
    userBanner?: string;
    userEmail?: string;
}

/**
 * 更新密码请求
 */
export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

/**
 * 关注用户信息
 */
export interface FollowUser {
    _id: string;
    userName: string;
    userImg: string;
    userDesc?: string;
}

/**
 * 关注状态响应
 */
export interface FollowStatusResponse {
    isFollowing: boolean;
}
