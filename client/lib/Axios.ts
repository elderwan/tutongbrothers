import axios from "axios";
import { setCookie, getCookie } from 'cookies-next';
import { BASE_URL } from "@/next.config";

let openLoginDialog: () => void = () => { };

// 提供给外部设置“弹登录框”的回调
export const setLoginDialogHandler = (handler: () => void) => {
    openLoginDialog = handler;
};

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // 关键：允许携带 cookie
});

// 请求拦截器：从 cookie 取 token
instance.interceptors.request.use((config) => {
    const token = getCookie("token"); // 读 cookie 里的 token
    if (token) {
        config.headers!["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截器：401 弹登录框
instance.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            // 清理掉过期的 token 和用户信息
            setCookie("token", "", { maxAge: 0 });
            setCookie("user", "", { maxAge: 0 });
            
            // 打开登录框
            openLoginDialog();
        }
        return Promise.reject(error);
    }
);

export default instance;
