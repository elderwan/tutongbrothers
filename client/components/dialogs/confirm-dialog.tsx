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
 * Confirm information interface
 */
interface ConfirmInfo {
    title: string
    msg: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
}

/**
 * Confirm dialog context interface
 */
interface ConfirmDialogContextType {
    showConfirm: (info: ConfirmInfo) => void
    hideConfirm: () => void
}

/**
 * Confirm dialog context
 */
const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

/**
 * Confirm dialog provider component props
 */
interface ConfirmDialogProviderProps {
    children: ReactNode
}

/**
 * Global confirm dialog provider
 */
export function ConfirmDialogProvider({ children }: ConfirmDialogProviderProps) {
    const [confirm, setConfirm] = useState<ConfirmInfo | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const showConfirm = (info: ConfirmInfo) => {
        setConfirm(info)
        setIsOpen(true)
    }

    const hideConfirm = () => {
        setIsOpen(false)
        // Delay clearing confirm info to wait for animation completion
        setTimeout(() => setConfirm(null), 200)
    }

    const handleConfirm = () => {
        confirm?.onConfirm?.()
        hideConfirm()
    }

    const handleCancel = () => {
        confirm?.onCancel?.()
        hideConfirm()
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            // When dialog is closed without explicit action, treat as cancel
            confirm?.onCancel?.()
            setTimeout(() => setConfirm(null), 200)
        }
    }

    return (
        <ConfirmDialogContext.Provider value={{ showConfirm, hideConfirm }}>
            {children}

            <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
                <AlertDialogContent className="mx-4 max-w-[calc(100vw-2rem)] sm:mx-auto sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle> {confirm?.title || "Confirm"} </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirm?.msg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center sm:justify-end">
                        <AlertDialogCancel onClick={handleCancel}>
                            {confirm?.cancelText || "Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                            {confirm?.confirmText || "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmDialogContext.Provider>
    )
}

/**
 * Hook for using confirm dialog
 */
export function useConfirmDialog(): ConfirmDialogContextType {
    const context = useContext(ConfirmDialogContext)
    if (!context) {
        throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider")
    }
    return context
}