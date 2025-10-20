"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

/**
 * Error information interface
 */
interface ErrorInfo {
    code: number
    msg: string
    title?: string
    onClose?: () => void // 🔥 新增：关闭后执行的回调
}

/**
 * Error dialog context interface
 */
interface ErrorDialogContextType {
    showError: (error: ErrorInfo) => void
    hideError: () => void
}

/**
 * Error dialog context
 */
const ErrorDialogContext = createContext<ErrorDialogContextType | undefined>(undefined)

/**
 * Error dialog provider component props
 */
interface ErrorDialogProviderProps {
    children: ReactNode
}

/**
 * Global error dialog provider
 */
export function ErrorDialogProvider({ children }: ErrorDialogProviderProps) {
    const [error, setError] = useState<ErrorInfo | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const showError = (errorInfo: ErrorInfo) => {
        setError(errorInfo)
        setIsOpen(true)
    }

    const hideError = () => {
        
        setIsOpen(false)
        // Delay clearing error info to wait for animation completion
        setTimeout(() => setError(null), 200)
    }

    const handleOkay = () => {
        error?.onClose?.()
        hideError()
    }

    const handleCancel = () => {
        error?.onClose?.()
        hideError()
    }

    return (
        <ErrorDialogContext.Provider value={{ showError, hideError }}>
            {children}

            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center sm:text-left">
                            {error?.title || "Error"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center sm:text-left">
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                    Error Code: <span className="font-mono text-destructive">{error?.code}</span>
                                </div>
                                <div className="text-sm break-words">
                                    {error?.msg}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
                        <AlertDialogCancel
                            onClick={handleCancel}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleOkay}
                            className="w-full sm:w-auto"
                        >
                            Okay
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ErrorDialogContext.Provider>
    )
}

/**
 * Hook for using error dialog
 * @returns Error dialog control methods
 */
export function useErrorDialog(): ErrorDialogContextType {
    const context = useContext(ErrorDialogContext)
    if (!context) {
        throw new Error("useErrorDialog must be used within an ErrorDialogProvider")
    }
    return context
}

/**
 * Convenient error display function
 * @param code Error code
 * @param msg Error message
 * @param title Optional title
 */
export function showGlobalError(code: number, msg: string, title?: string) {
    // This function needs to use useErrorDialog Hook inside a component
    console.warn("showGlobalError should be used with useErrorDialog hook in component")
}