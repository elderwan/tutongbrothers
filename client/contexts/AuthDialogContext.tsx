"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import SigninDialog from "@/components/auth/signin-dialog"; // 你自己的登录对话框组件
import TokenExpiredDialog from "@/components/auth/token-expired-dialog";
import { setGlobalAuthDialog } from "@/lib/ApiFetch";
 import SignupDialog from "@/components/auth/signup-dialog";

interface AuthDialogContextType {
    openSignIn: () => void;
    closeSignIn: () => void;
    showTokenExpired: () => void;
   openSignUp: () => void;
   closeSignUp: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(undefined);

export const AuthDialogProvider = ({ children }: { children: ReactNode }) => {
    const [showSignIn, setShowSignIn] = useState(false);
    const [showTokenExpiredDialog, setShowTokenExpiredDialog] = useState(false);
   const [showSignUp, setShowSignUp] = useState(false);

    const openSignIn = () => setShowSignIn(true);
    const closeSignIn = () => setShowSignIn(false);
   const openSignUp = () => setShowSignUp(true);
   const closeSignUp = () => setShowSignUp(false);

    const showTokenExpired = () => {
        setShowTokenExpiredDialog(true);
    };

    const handleTokenExpiredConfirm = () => {
        setShowTokenExpiredDialog(false);
        // 关闭token过期提示后，打开登录窗口
        setShowSignIn(true);
    };

    const handleSignInClose = (open: boolean) => {
        setShowSignIn(open);

    };

    const handleSignUpClose = (open: boolean) => {
        setShowSignUp(open);
    };

    // Register the global auth dialog opener
    useEffect(() => {
        setGlobalAuthDialog(showTokenExpired);
    }, []);

    return (
        <AuthDialogContext.Provider
            value={{
                openSignIn,
                closeSignIn,
                showTokenExpired,
               openSignUp,
               closeSignUp,
            }}
        >
            {children}
            
            {/* Token过期提示对话框 */}
            <TokenExpiredDialog 
                open={showTokenExpiredDialog} 
                onConfirm={handleTokenExpiredConfirm}
            />
            
            {/* 登录对话框统一在这里渲染 */}
            <SigninDialog open={showSignIn} onOpenChange={handleSignInClose} />

            {/* 注册对话框统一在这里渲染 */}
            <SignupDialog open={showSignUp} onOpenChange={handleSignUpClose} />
        </AuthDialogContext.Provider>
    );
};

export const useAuthDialog = () => {
    const context = useContext(AuthDialogContext);
    if (!context) throw new Error("useAuthDialog must be used within AuthDialogProvider");
    return context;
};
