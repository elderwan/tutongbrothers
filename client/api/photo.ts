import { BASE_URL } from "@/next.config";
import { ApiResponse } from "@/lib/Response";
import { api } from "@/lib/ApiFetch";

export interface Photo {
    _id: string;
    url: string;
    isPortrait: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

// 获取所有照片
export async function getPhotos(): Promise<ApiResponse<Photo[]>> {
    return await api.get(`${BASE_URL}/photos`);
}

// 上传照片（需要管理员权限）
export async function uploadPhoto(
    url: string,
    isPortrait: boolean,
    order: number
): Promise<ApiResponse<Photo>> {
    return await api.post(`${BASE_URL}/photos`, { url, isPortrait, order });
}

// 更新照片
export async function updatePhoto(
    id: string,
    url: string,
    isPortrait: boolean,
    order: number
): Promise<ApiResponse<Photo>> {
    return await api.put(`${BASE_URL}/photos/${id}`, { url, isPortrait, order });
}

// 删除照片
export async function deletePhoto(id: string): Promise<ApiResponse<null>> {
    return await api.del(`${BASE_URL}/photos/${id}`);
}