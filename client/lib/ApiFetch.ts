// 导入cookie处理函数
import { getCookie, deleteCookie } from 'cookies-next';
import type User from '@/type/User';

// Global variable to store auth dialog opener function
let globalOpenSignIn: (() => void) | null = null;

// Function to set the global auth dialog opener
export function setGlobalAuthDialog(openSignIn: () => void) {
    globalOpenSignIn = openSignIn;
}

// Function to handle token expiration
function handleTokenExpiration() {
    // Clear all auth-related cookies
    deleteCookie('token');
    deleteCookie('user');

    // Trigger token expired dialog if available
    if (globalOpenSignIn) {
        globalOpenSignIn();
    }
}

// 创建一个通用的API请求工具，自动从cookie获取token和userId
export function createApiFetch(isAuthEndpoint: boolean = false) {
    // 通用请求方法
    async function apiFetch<T = any>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> {
        // 只有非认证接口（非登录/注册）才添加token和userId
        let headers: Record<string, string> = {
            ...(options.headers as Record<string, string> || {}),
            "Content-Type": "application/json",
        };

        // 如果不是认证端点（登录/注册），则添加token和userId
        if (!isAuthEndpoint) {
            const token = getCookie('token') as string;
            const userStr = getCookie('user') as string;
            let userId = '';

            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user.id || '';
                } catch (error) {
                    console.error('Failed to parse user data from cookie:', error);
                }
            }

            headers = {
                ...headers,
                "Authorization": token ? `Bearer ${token}` : "",
                "userId": userId,
            };
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Check for token expiration (401 Unauthorized)
        if (response.status === 401 && !isAuthEndpoint) {
            handleTokenExpiration();
            // throw new Error('Token expired. Please login again.');
        }

        let data: any = null;
        try {
            data = await response.json();
        } catch (err) {
            console.warn("Failed to parse JSON:", err);
        }

        // console.log("response=>", data)


        // 如果状态码不ok，抛出错误并携带后端返回的 JSON
        // if (!response.ok) {
        //     const error: any = new Error(`API Error: ${response.status} ${response.statusText}`);
        //     error.status = response.status;
        //     error.data = data;  // 把后端返回 JSON 放进去
        //     throw error;
        // }

        return data;
    }

    // 简化的请求方法
    return {
        get: <T = any>(url: string) =>
            apiFetch<T>(url, { method: "GET" }),

        post: <T = any>(url: string, body: any) =>
            apiFetch<T>(url, { method: "POST", body: JSON.stringify(body) }),

        put: <T = any>(url: string, body: any) =>
            apiFetch<T>(url, { method: "PUT", body: JSON.stringify(body) }),

        patch: <T = any>(url: string, body: any) =>
            apiFetch<T>(url, { method: "PATCH", body: JSON.stringify(body) }),

        del: <T = any>(url: string) =>
            apiFetch<T>(url, { method: "DELETE" }),
    };
}

// 创建认证接口专用的API请求工具（登录/注册）
export const authApi = createApiFetch(true);

// 创建普通接口的API请求工具（需要token验证）
export const api = createApiFetch(false);

// 为了向后兼容，提供一个React Hook版本
export function useApiFetch(isAuthEndpoint: boolean = false) {
    return createApiFetch(isAuthEndpoint);
}