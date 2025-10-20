import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";
import type {
    User,
    UserProfile,
    UpdateProfileRequest,
    UpdatePasswordRequest,
    FollowUser
} from "@/types";

// 重新导出类型供向后兼容
export type { UserProfile, UpdateProfileRequest, UpdatePasswordRequest, FollowUser };

/**
 * 获取用户资料
 * @param userId - 用户ID，不传则获取当前登录用户资料
 */
export async function getUserProfile(userId?: string): Promise<ApiResponse<UserProfile>> {
    const endpoint = userId ? `${BASE_URL}/users/profile/${userId}` : `${BASE_URL}/users/profile`;
    return await api.get<ApiResponse<UserProfile>>(endpoint);
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(
    data: UpdateProfileRequest
): Promise<ApiResponse<UserProfile>> {
    return await api.put<ApiResponse<UserProfile>>(`${BASE_URL}/users/profile`, data);
}

/**
 * 更新用户头像
 */
export async function updateUserAvatar(imageUrl: string): Promise<ApiResponse<{ userImg: string }>> {
    return await api.put<ApiResponse<{ userImg: string }>>(`${BASE_URL}/users/avatar`, { userImg: imageUrl });
}

/**
 * 更新用户背景图
 */
export async function updateUserBanner(imageUrl: string): Promise<ApiResponse<{ userBanner: string }>> {
    return await api.put<ApiResponse<{ userBanner: string }>>(`${BASE_URL}/users/banner`, { userBanner: imageUrl });
}

/**
 * 更新用户密码
 */
export async function updateUserPassword(
    data: UpdatePasswordRequest
): Promise<ApiResponse<void>> {
    return await api.put<ApiResponse<void>>(`${BASE_URL}/users/password`, data);
}

/**
 * 获取关注者列表
 */
export async function getFollowers(
    userId?: string,
    page: number = 1,
    limit: number = 20
): Promise<ApiResponse<{ users: FollowUser[]; pagination: any }>> {
    const endpoint = userId
        ? `${BASE_URL}/users/${userId}/followers?page=${page}&limit=${limit}`
        : `${BASE_URL}/users/followers?page=${page}&limit=${limit}`;
    return await api.get<ApiResponse<{ users: FollowUser[]; pagination: any }>>(endpoint);
}

/**
 * 获取关注中列表
 */
export async function getFollowing(
    userId?: string,
    page: number = 1,
    limit: number = 20
): Promise<ApiResponse<{ users: FollowUser[]; pagination: any }>> {
    const endpoint = userId
        ? `${BASE_URL}/users/${userId}/following?page=${page}&limit=${limit}`
        : `${BASE_URL}/users/following?page=${page}&limit=${limit}`;
    return await api.get(endpoint);
}

/**
 * 检查用户名是否可用
 */
export async function checkUsernameAvailable(userName: string): Promise<ApiResponse<{ available: boolean }>> {
    return await api.get<ApiResponse<{ available: boolean }>>(`${BASE_URL}/users/check-username?userName=${encodeURIComponent(userName)}`);
}

/**
 * 检查邮箱是否可用
 */
export async function checkEmailAvailable(email: string): Promise<ApiResponse<{ available: boolean }>> {
    return await api.get<ApiResponse<{ available: boolean }>>(`${BASE_URL}/users/check-email?email=${encodeURIComponent(email)}`);
}
