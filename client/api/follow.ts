import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";

export interface FollowStatusResp {
  isFollowing: boolean;
}

export async function getFollowStatus(targetUserId: string): Promise<ApiResponse<FollowStatusResp>> {
  return await api.get(`${BASE_URL}/users/${targetUserId}/follow-status`);
}

export async function followUser(targetUserId: string): Promise<ApiResponse<null>> {
  return await api.post(`${BASE_URL}/users/${targetUserId}/follow`, {});
}

export async function unfollowUser(targetUserId: string): Promise<ApiResponse<null>> {
  return await api.post(`${BASE_URL}/users/${targetUserId}/unfollow`, {});
}