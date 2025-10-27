"use client"
import { useId } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { loginApi } from "@/api/auth";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import { useRouter } from "next/navigation";   // App Router
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";

// 定义组件props类型
interface SigninDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function SigninDialog({ open, onOpenChange }: SigninDialogProps) {
    const { loginCookie } = useAuth();
    const { openSignUp, closeSignIn } = useAuthDialog();

    const router = useRouter();
    const id = useId()
    const { showError } = useErrorDialog()
    const { showSuccess } = useSuccessDialog()

    const [emailOrAccount, setEmailOrAccount] = useState("")
    const [password, setPassword] = useState("")
    const [isOpen, setIsOpen] = useState(false)  // set sign in window open status

    // 使用传入的open和onOpenChange，如果没有则使用内部状态
    const dialogOpen = open !== undefined ? open : isOpen;
    const handleOpenChange = onOpenChange || setIsOpen;

    async function handleSubmitLogin() {
        try {
            const res = await loginApi(emailOrAccount, password);
            console.log("Login response:", res)
            if (res.code === 200) {
                console.log("Login successful:", res.data)
                // set token in cookie
                loginCookie(res.data.token, res.data.user)
                // show success message
                showSuccess({
                    title: "Sign In",
                    msg: "Sign in success!",
                    onConfirm: () => {
                        // use router to refresh the page
                        router.refresh();
                        // reload the page
                        window.location.reload();
                    }
                })

                // close the sign in window
                handleOpenChange(false)

            } else {
                // Use global error dialog to display error
                showError({
                    code: res.code,
                    msg: res.msg,
                    title: "Login Failed"
                })
            }
        } catch (error: any) {
            console.log(error);
        }

    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-gray-300"
                        aria-hidden="true"
                    >
                        <Image
                            src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761116328/mx96_vdrocj.jpg"
                            className="w-11 h-11 rounded-full object-cover"
                            alt="mx96"
                            width={44}
                            height={44}
                            quality={85}
                            loading="lazy"
                        />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            Login to see more about tutong brothers!
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="space-y-5" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitLogin();
                }}>
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-email`}>Email / account</Label>
                            <Input
                                id={`${id}-email`}
                                placeholder="example@google.com"
                                type="text"
                                required
                                value={emailOrAccount}
                                onChange={(e) => setEmailOrAccount(e.target.value)}
                            />
                        </div>
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-password`}>Password</Label>
                            <Input
                                id={`${id}-password`}
                                placeholder="Enter your password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account?</span>
                        <Button
                            type="button"
                            variant="link"
                            className="px-1"
                            onClick={() => {
                                // 关闭登录并打开注册
                                handleOpenChange(false);
                                closeSignIn();
                                openSignUp();
                            }}
                        >
                            Sign up
                        </Button>
                    </div>
                </form>

                <div>
                    <img className="rounded-2xl" src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761542709/tutonglogin_vewgfs.png" alt="tutonglogin" />                </div>

            </DialogContent>
        </Dialog>
    )
}
