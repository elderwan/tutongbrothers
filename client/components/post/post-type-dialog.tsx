"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, MessageSquareIcon } from "lucide-react"

interface PostTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectType: (type: 'blog' | 'post') => void
}

export default function PostTypeDialog({ open, onOpenChange, onSelectType }: PostTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What do you want to share?</DialogTitle>
          <DialogDescription>
            Choose between a detailed blog post or a quick social post
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="h-32 flex-col gap-3 hover:border-primary hover:bg-primary/5"
            onClick={() => {
              onSelectType('blog')
              onOpenChange(false)
            }}
          >
            <BookOpenIcon size={32} className="text-primary" />
            <div className="text-center">
              <div className="font-semibold">Blog</div>
              <div className="text-xs text-muted-foreground">Write a full article</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex-col gap-3 hover:border-accent hover:bg-accent/5"
            onClick={() => {
              onSelectType('post')
              onOpenChange(false)
            }}
          >
            <MessageSquareIcon size={32} className="text-accent" />
            <div className="text-center">
              <div className="font-semibold">Post</div>
              <div className="text-xs text-muted-foreground">Quick update</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
