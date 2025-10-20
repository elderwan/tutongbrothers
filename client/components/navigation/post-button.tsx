import React from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import SigninDialog from "@/components/auth/signin-dialog"; // 导入登录对话框组件 
import { useAuth } from '@/contexts/AuthContext'; // 导入认证上下文

const NaviPostButton = () => {
    const { isAuthenticated } = useAuth(); // 使用全局认证状态
    const [showSignIn, setShowSignIn] = useState(false); // 添加状态控制登录对话框显示 

    const { showSuccess } = useSuccessDialog();

    const handlePostClick = () => {
        if (!isAuthenticated) {
            showSuccess({
                title: "Sign in required",
                msg: "Sign in then post your fantasy!",
                onConfirm: () => {
                    // 显示登录对话框 
                    setShowSignIn(true);
                }
            });
        } else {
            window.location.href = "/post";
        }
    };

    return (
        <>
            <Button onClick={handlePostClick} size="sm" className="text-sm max-sm:aspect-square max-sm:p-0">
                <PlusIcon
                    className="opacity-60 sm:-ms-1"
                    size={16}
                    aria-hidden="true"
                />
                <span className="max-sm:sr-only">Post</span>
            </Button>
            {/* 登录对话框 */}
            <SigninDialog
                open={showSignIn}
                onOpenChange={setShowSignIn}
            />
        </>
    )
}

export default NaviPostButton