"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, X, Eye } from "lucide-react"
import { useErrorDialog } from '@/components/dialogs/error-dialog'
import { useSuccessDialog } from '@/components/dialogs/success-dialog'
import { useConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { likePostApi, deletePostApi, getPostCommentsCount } from "@/api/post"
import { dateFormat } from "@/lib/date"
import { useAuth } from '@/contexts/AuthContext'

interface PostCardCompactProps {
  post: {
    _id: string
    title: string
    content: string
    userName: string
    userImg: string
    userId: string
    images: string[]
    likes: string[]
    createdAt: string
    views: number
  }
  onDeleted?: (postId: string) => void
  onClick?: (postId: string) => void
}

export default function PostCardCompact({ post, onDeleted, onClick }: PostCardCompactProps) {
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)
  const { showSuccess } = useSuccessDialog()
  const { showError } = useErrorDialog()
  const { showConfirm } = useConfirmDialog()
  const { user } = useAuth()

  const isAuthor = !!user?.id && user.id === post.userId

  useEffect(() => {
    checkIsLiked()
    loadCommentsCount()
  }, [])

  const checkIsLiked = () => {
    if (post.likes.includes(user?.id as string)) {
      setIsLiked(true)
    }
  }

  const loadCommentsCount = async () => {
    try {
      const response = await getPostCommentsCount(post._id)
      if (response.code === 200) {
        setCommentsCount(response.data.total)
      }
    } catch (error) {
      console.error("Failed to load comments count:", error)
    }
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await likePostApi(post._id)
      if (response.code === 200) {
        setIsLiked(!isLiked)
        setLikesCount(response.data.likesCount)
      }
    } catch (error) {
      showError({
        code: 500,
        title: "Error",
        msg: "Failed to like post"
      })
    }
  }

  const handleDelete = async () => {
    try {
      const response = await deletePostApi(post._id)
      if (response.code === 200) {
        showSuccess({
          title: "Delete Post",
          msg: "Post deleted successfully",
          onConfirm: () => { }
        })
        if (onDeleted) onDeleted(post._id)
      }
    } catch (error) {
      showError({
        code: 500,
        title: "Error",
        msg: "Failed to delete post"
      })
    }
  }

  const getBriefContent = (content: string) => {
    if (content.length > 100) {
      return content.substring(0, 100) + "..."
    }
    return content
  }

  return (
    <div
      className="p-4 hover:bg-gray-50 transition-shadow cursor-pointer bg-cream relative"
      onClick={() => onClick?.(post._id)}
    >
      {/* Delete button - Top left */}
      {isAuthor && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-cream z-10"
          onClick={(e) => {
            e.stopPropagation()
            showConfirm({
              title: "Delete Post",
              msg: "Are you sure you want to delete this post? This action cannot be undone.",
              confirmText: "Confirm",
              cancelText: "Cancel",
              onConfirm: handleDelete,
            })
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}

      <div className="flex gap-3">
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          {/* Title or Author */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg mb-1 line-clamp-2">
              {post.title}
            </h3>

          </div>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {getBriefContent(post.content)}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{dateFormat(post.createdAt)}</span>
            <button
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
              onClick={handleLike}
            >
              <Heart className={`h-3 w-3 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{likesCount}</span>
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {commentsCount}
            </span>
            {isAuthor && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.views}
              </span>
            )}
          </div>
        </div>

        {/* Right: Cover Image */}
        {post.images && post.images.length > 0 && (
          <div className="mr-6 w-24 h-24 flex-shrink-0">
            <img
              src={post.images[0]}
              alt={post.title || "Post"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

      </div>
    </div>
  )
}
