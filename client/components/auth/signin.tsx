"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { LogIn } from "lucide-react"
import SigninDialog from "./signin-dialog"

// 定义组件props类型
interface SigninProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function Component({ open, onOpenChange }: SigninProps) {
    const [isOpen, setIsOpen] = useState(false)  // set sign in window open status

    // 使用传入的open和onOpenChange，如果没有则使用内部状态
    const dialogOpen = open !== undefined ? open : isOpen;
    const handleOpenChange = onOpenChange || setIsOpen;

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 max-sm:aspect-square"
                >
                    <LogIn
                        className="opacity-60 sm:-ms-1"
                        size={16}
                        aria-hidden="true"
                    />
                    <span className="">Sign in</span>
                </Button>
            </DialogTrigger>
            <SigninDialog open={dialogOpen} onOpenChange={handleOpenChange} />
        </Dialog>
    )
}