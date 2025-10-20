"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle } from "lucide-react"

/**
 * Success information interface
 */
interface SuccessInfo {
    title: string
    msg: string
    onConfirm?: () => void
}

/**
 * Success dialog context interface
 */
interface SuccessDialogContextType {
    showSuccess: (success: SuccessInfo) => void
    hideSuccess: () => void
}

/**
 * Success dialog context
 */
const SuccessDialogContext = createContext<SuccessDialogContextType | undefined>(undefined)

/**
 * Success dialog provider component props
 */
interface SuccessDialogProviderProps {
    children: ReactNode
}

/**
 * Global success dialog provider
 */
export function SuccessDialogProvider({ children }: SuccessDialogProviderProps) {
    const [success, setSuccess] = useState<SuccessInfo | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const showSuccess = (successInfo: SuccessInfo) => {
        setSuccess(successInfo)
        setIsOpen(true)
    }

    const hideSuccess = () => {
        setIsOpen(false);
        // Delay clearing success info to wait for animation completion
        setTimeout(() => setSuccess(null), 200);
    }

    const handleOkay = () => {
        success?.onConfirm?.();
        hideSuccess();
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // 当对话框关闭时，执行确认回调（无论是点击按钮还是点击外部）
            success?.onConfirm?.();
        }
        setIsOpen(open);
        if (!open) {
            // Delay clearing success info to wait for animation completion
            setTimeout(() => setSuccess(null), 200);
        }
    }

    return (
        <SuccessDialogContext.Provider value={{ showSuccess, hideSuccess }}>
            {children}

            <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
                <AlertDialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-lg">
                    <AlertDialogHeader>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                            <CheckCircle className="h-6 w-6 text-primary" />
                            <AlertDialogTitle className="text-center sm:text-left text-primary">
                                {success?.title}
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-center sm:text-left">
                            <div className="text-sm break-words text-primary">
                                {success?.msg}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center sm:justify-end">
                        <AlertDialogAction
                            onClick={handleOkay}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
                        >
                            enter
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SuccessDialogContext.Provider>
    )
}

/**
 * Hook for using success dialog
 * @returns Success dialog control methods
 */
export function useSuccessDialog(): SuccessDialogContextType {
    const context = useContext(SuccessDialogContext)
    if (!context) {
        throw new Error("useSuccessDialog must be used within a SuccessDialogProvider")
    }
    return context
}

/**
 * Convenient success display function
 * @param title Success title
 * @param msg Success message
 */
export function showGlobalSuccess(title: string, msg: string) {
    // This function needs to use useSuccessDialog Hook inside a component
    console.warn("showGlobalSuccess should be used with useSuccessDialog hook in component")
}