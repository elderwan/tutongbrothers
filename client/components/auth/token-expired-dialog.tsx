"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface TokenExpiredDialogProps {
  open: boolean
  onConfirm: () => void
}

export default function TokenExpiredDialog({ open, onConfirm }: TokenExpiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // 只允许通过确认按钮关闭，防止意外关闭导致弹窗顺序混乱
      if (!isOpen) {
        onConfirm();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            token expired
          </DialogTitle>
          <DialogDescription>
            your sign up status is expired, please sign up again
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onConfirm} className="w-fit">
            confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}