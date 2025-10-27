"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { useErrorDialog } from '@/components/dialogs/error-dialog'
import { likePostApi, getPostByIdApi, getPostCommentsCount } from "@/api/post"
import { dateFormat } from "@/lib/date"
import { useAuth } from '@/contexts/AuthContext'
import { PostCommentList } from "./post-comment-list"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
}

export default function PostDetailDialog({ open, onOpenChange, postId }: PostDetailDialogProps) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [likesCount, setLikesCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [commentsCount, setCommentsCount] = useState(0)
  const { showError } = useErrorDialog()
  const { user } = useAuth()

  useEffect(() => {
    if (open && postId) {
      loadPost()
      loadCommentsCount()
      setCurrentImageIndex(0)
    }
  }, [open, postId])

  const loadPost = async () => {
    try {
      setLoading(true)
      const response = await getPostByIdApi(postId)
      if (response.code === 200) {
        setPost(response.data.post)
        setLikesCount(response.data.post.likes.length)
        setIsLiked(user?.id ? response.data.post.likes.includes(user.id) : false)
      }
    } catch (error) {
      showError({
        code: 500,
        title: "Error",
        msg: "Failed to load post"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCommentsCount = async () => {
    try {
      const response = await getPostCommentsCount(postId)
      if (response.code === 200) {
        setCommentsCount(response.data.total)
      }
    } catch (error) {
      console.error("Failed to load comments count:", error)
    }
  }

  const handleLike = async () => {
    try {
      const response = await likePostApi(postId)
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

  const nextImage = () => {
    if (post?.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  if (!post) return null

  const isAuthor = user?.id === post.userId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1000px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Left Side - Images Only */}
            <div className="flex-1 flex flex-col bg-white lg:max-w-[55%] overflow-hidden">
              {/* Image Carousel */}
              {post.images && post.images.length > 0 ? (
                <div className="flex-1 relative flex items-center justify-center bg-white overflow-hidden">
                  <img
                    src={post.images[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="max-h-full max-w-full w-auto h-auto object-contain"
                  />
                  {post.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={prevImage}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                        onClick={nextImage}
                        disabled={currentImageIndex === post.images.length - 1}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {post.images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-white min-h-[200px]">
                  <p className="text-gray-400">No images</p>
                </div>
              )}

              {/* Thumbnail Strip */}
              {post.images && post.images.length > 1 && (
                <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
                  <div className="flex gap-2 overflow-x-auto">
                    {post.images.map((img: string, index: number) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 rounded cursor-pointer overflow-hidden transition-all ${index === currentImageIndex
                          ? 'ring-2 ring-accent opacity-100'
                          : 'opacity-50 hover:opacity-75'
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - User Info, Content & Comments */}
            <div className="w-full lg:w-[45%] flex flex-col bg-white border-t lg:border-t-0 lg:border-l overflow-hidden">
              {/* Header with User Info */}
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.userImg} alt={post.userName} sizes="48px" quality={90} />
                      <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-base">{post.userName}</p>
                      <p className="text-xs text-gray-500">{dateFormat(post.createdAt)}</p>
                    </div>
                    {!isAuthor && (
                      <Button size="sm" className="ml-2">
                        Follow
                      </Button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="max-h-[120px] overflow-y-auto">
                  {/* Post Title */}
                  {post.title && (
                    <h2 className="font-bold text-lg mb-2 text-gray-900">
                      {post.title}
                    </h2>
                  )}
                  {/* Post Text */}
                  <p className="text-sm whitespace-pre-wrap">
                    {renderContentWithMentions(post.content)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1 h-8"
                      onClick={handleLike}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      <span className="font-semibold">{likesCount}</span>
                    </Button>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">{commentsCount}</span>
                    </div>
                  </div>
                  {isAuthor && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-4 py-3 border-b flex-shrink-0">
                  <h3 className="font-semibold text-sm text-gray-700">Comments</h3>
                </div>

                {/* Comments List with Scroll */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <PostCommentList postId={postId} onCommentUpdate={loadCommentsCount} />
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}