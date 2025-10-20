"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import User from '@/type/User';

// 定义认证上下文的类型
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loginCookie: (token: string, user: User) => void;
  logoutCookie: () => void;
  updateUser: (user: Partial<User>) => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件的属性类型
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 初始化时从cookie获取认证信息
  useEffect(() => {
    const storedToken = getCookie('token') as string;
    const storedUser = getCookie('user') as string;

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user data from cookie:', error);
        }
      }
    }
  }, []);

  // 登录函数
  const loginCookie = (newToken: string, newUser: User) => {
    // 设置状态
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);

    // 设置cookie
    setCookie("token", newToken, { maxAge: 60 * 60 * 24 });
    setCookie("user", JSON.stringify(newUser), { maxAge: 60 * 60 * 24 });
  };

  // 登出函数
  const logoutCookie = () => {
    // 清除状态
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // 清除cookie
    setCookie("token", "", { maxAge: 0 });
    setCookie("user", "", { maxAge: 0 });
  };

  // 更新用户信息函数
  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    setCookie("user", JSON.stringify(updatedUser), { maxAge: 60 * 60 * 24 });
  };

  // 提供上下文值
  const value = {
    token,
    user,
    isAuthenticated,
    loginCookie,
    logoutCookie,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 自定义hook，用于在组件中使用认证上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}