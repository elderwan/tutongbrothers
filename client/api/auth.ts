import { BASE_URL } from "@/next.config"
import { ApiResponse } from "@/lib/Response"
import { authApi } from "@/lib/ApiFetch"

export async function loginApi(emailOrAccount: string, password: string): Promise<ApiResponse> {
    return await authApi.post(`${BASE_URL}/users/login`, { emailOrAccount, password });
}

export async function registerApi(userData: any): Promise<ApiResponse> {
    return await authApi.post(`${BASE_URL}/users/signup`, userData);
}
