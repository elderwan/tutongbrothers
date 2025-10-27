"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, X, Eye } from "lucide-react"
import { useErrorDialog } from '@/components/dialogs/error-dialog'
import { useSuccessDialog } from '@/components/dialogs/success-dialog'
import { useConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { likePostApi, deletePostApi, getPostCommentsCount } from "@/api/post"
import { dateFormat } from "@/lib/date"
import { useAuth } from '@/contexts/AuthContext'
import Link from "next/link"

interface PostCardProps {
  post: {
    _id: string
    title?: string
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

export default function PostCard({ post, onDeleted, onClick }: PostCardProps) {
  const router = useRouter()
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

  const renderContentWithMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g)
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-accent hover:underline cursor-pointer">
            {part}
          </span>
        )
      }
      return part
    })
  }

  const getBriefContent = (content: string) => {
    if (content.length > 150) {
      return content.substring(0, 150) + "..."
    }
    return content
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(post._id)
    }
  }

  return (
    <div
      className="glass border border-white/20 rounded-beagle-lg overflow-hidden shadow-beagle-md hover:shadow-beagle-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Post Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.userImg} alt={post.userName} />
              <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.userName}</p>
              <p className="text-xs text-gray-500">
                {dateFormat(post.createdAt)}
              </p>
            </div>
          </div>
          {isAuthor && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
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
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {post.title && <h3 className="font-bold mt-2 text-forest-green">{post.title}</h3>}
        <span className="inline-block bg-light-beige text-forest-green text-xs font-semibold px-3 py-1.5 rounded-beagle-sm mt-2">
          Short Post
        </span>
      </div>


      {/* Images Below - Max 9 with overlay on last */}
      {post.images && post.images.length > 0 && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.images[0]}
            alt="Post preview"
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
          {renderContentWithMentions(getBriefContent(post.content))}
        </p>

        {/* Extra images display (if more than 1) */}
        {post.images && post.images.length > 1 && (
          <div className={`grid gap-2 mb-3 ${post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
            {post.images.slice(1, 9).map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-beagle-sm shadow-beagle-sm">
                <img
                  src={image}
                  alt={`Post image ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                {index === 7 && post.images.length > 9 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">+{post.images.length - 9}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={(e) => {
                e.stopPropagation()
                if (onClick) onClick(post._id)
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{commentsCount}</span>
            </Button>
          </div>
          {isAuthor && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              <span>{post.views}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
