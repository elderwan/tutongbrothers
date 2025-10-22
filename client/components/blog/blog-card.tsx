"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import { useErrorDialog } from '@/components/dialogs/error-dialog';
import { useSuccessDialog } from '@/components/dialogs/success-dialog';
import { likeBlog, deleteBlog } from "@/api/blog";
import { getBlogComments } from "@/api/comment";
import { CommentList } from "./comment-list";
import { CommentListCompact } from "./comment-list-compact";
import { dateFormat } from "@/lib/date";
import { useAuth } from '@/contexts/AuthContext';
import Link from "next/link";
import { useConfirmDialog } from "@/components/dialogs/confirm-dialog"



// 定义博客类型
interface Blog {
    _id: string;
    title: string;
    description: string; // Blog description/summary
    content: string;
    userName: string;
    userImg: string;
    type: string;
    images: string[];
    likes: string[];
    comments: any[];
    createdAt: string;
    // 新增：用于作者判定（可能为字符串ID或被 populate 的对象）
    userId?: User;
}

interface User {
    _id: string;
    userName: string;
    userImg: string;
}

interface BlogCardProps {
    blog: Blog;
    // 新增：删除后回调，用于从列表中移除该博客
    onDeleted?: (blogId: string) => void;
}

export function BlogCard({ blog, onDeleted }: BlogCardProps) {
    const router = useRouter();
    const [likesCount, setLikesCount] = useState(blog.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);
    const { showSuccess } = useSuccessDialog();
    const { showError } = useErrorDialog();
    const { user, token } = useAuth();
    // 新增：确认删除弹窗状态
    // 使用全局删除确认对话框，无需本地状态
    const { showConfirm } = useConfirmDialog();
    // 新增：判定作者
    const authorId = typeof blog.userId === 'string' ? blog.userId : (blog.userId as any)?.['_id'];
    const isAuthor = !!user?.id && !!authorId && user.id === authorId;

    // const formattedDate = format(now, 'yyyy-MM-dd HH:mm');

    useEffect(() => {
        checkIsLiked();
        loadCommentsCount();
    }, [])

    const checkIsLiked = () => {
        if (blog.likes.includes(user?.id as string)) {
            setIsLiked(true);
        }
    }

    const loadCommentsCount = async () => {
        try {
            const response = await getBlogComments(blog._id, 1, 1);
            if (response.code === 200) {
                setCommentsCount(response.data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to load comments count:", error);
        }
    }

    // 删除处理
    const handleDelete = async () => {
        try {
            const response = await deleteBlog(blog._id);
            if (response.code === 200) {
                showSuccess({
                    title: "Delete Blog",
                    msg: "Blog deleted successfully",
                    onConfirm: () => { }
                });
                if (onDeleted) onDeleted(blog._id);
            } else {
                showError({
                    code: response.code,
                    title: "Delete Failed",
                    msg: response.msg
                });
            }
        } catch (error) {
            showError({
                code: 500,
                title: "Delete Failed",
                msg: "Please try again later"
            });
            console.error("Failed to delete blog:", error);
        } finally {

            // dialog provider handles close
        }
    };

    // handle like
    const handleLike = async () => {
        try {
            // 这里应该传递实际的用户ID
            const userId = user?.id as string;
            const response = await likeBlog(blog._id, userId);

            if (response.code === 200) {
                setLikesCount(response.data.likesCount);
                setIsLiked(!isLiked);
            } else {
                showError({
                    code: response.code,
                    title: "error with like",
                    msg: response.msg
                });
            }
        } catch (error) {
            showError({
                code: 500,
                title: "unknown error with like",
                msg: "pls try agian later"
            });
            console.error("Failed to like blog:", error);
        }
    };

    // 评论更新回调
    const handleCommentUpdate = () => {
        loadCommentsCount();
    };

    // 获取博客描述，如果太长则截断
    const getBriefDescription = (description: string | null | undefined) => {
        if (description) {
            return description.substring(0, 100) + "...";
        } else {
            return description;
        }
    };

    return (
        <div
            className="glass border border-white/20 rounded-beagle-lg overflow-hidden shadow-beagle-md hover:shadow-beagle-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-fit"

        >
            {/* 博客头部 */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={blog.userId?.userImg} alt={blog.userId?.userName} />
                            <AvatarFallback>{blog.userId?.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{blog.userId?.userName}</p>
                            <p className="text-xs text-gray-500">
                                {dateFormat(blog.createdAt)}
                            </p>
                        </div>
                    </div>
                    {isAuthor && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                showConfirm({
                                    title: "Delete Blog",
                                    msg: "Are you sure you want to delete this blog? This action cannot be undone.",
                                    confirmText: "Confirm",
                                    cancelText: "Cancel",
                                    onConfirm: handleDelete,
                                });
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <h3 className="font-bold mt-2 text-forest-green">{blog.title}</h3>
                <span className="inline-block bg-light-beige text-forest-green text-xs font-semibold px-3 py-1.5 rounded-beagle-sm mt-2">
                    {blog.type}
                </span>
            </div>

            {/* 主图片展示 */}
            {blog.images && blog.images.length > 0 && (
                <Link href={`/blog/${blog._id}`}>
                    <div className="aspect-video overflow-hidden">
                        <img
                            src={blog.images[0]}
                            alt={blog.title}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </Link>
            )}

            {/* 博客内容 */}
            <div className="p-4">
                <Link href={`/blog/${blog._id}`}>
                    <p className="text-sm text-gray-700 mb-3">
                        {getBriefDescription(blog.description)}
                    </p>


                    {/* 额外图片展示 */}
                    {blog.images && blog.images.length > 1 && (
                        <div className="flex gap-2 mb-3">
                            {blog.images.slice(1, 4).map((image, index) => (
                                <div key={index} className="aspect-square w-1/4 overflow-hidden rounded-beagle-sm shadow-beagle-sm">
                                    <img
                                        src={image}
                                        alt={`Blog image ${index + 2}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                            {blog.images.length > 4 && (
                                <div className="aspect-square w-1/4 overflow-hidden rounded-beagle-sm bg-light-beige/50 border border-warm-orange/30 flex items-center justify-center">
                                    <span className="text-xs text-forest-green font-bold">+{blog.images.length - 4}</span>
                                </div>
                            )}
                        </div>
                    )}

                </Link>

                {/* 交互功能栏 */}
                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike();
                            }}
                        >
                            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            <span>{likesCount}</span>
                        </Button>
                        <Link href={`/blog/${blog._id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-1"
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     setShowComments(!showComments);
                            // }}
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span>{commentsCount}</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 评论区域 */}
                {/* {showComments && (
                  <div className="mt-4 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
                    <CommentList
                      blogId={blog._id}
                      onCommentUpdate={handleCommentUpdate}
                      className="max-w-none w-full mx-0"
                    />
                  </div>
                )} */}
                {/* {showComments && (
                    <div className="mt-4 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
                        <CommentListCompact
                            blogId={blog._id}
                            onCommentUpdate={handleCommentUpdate}
                            className="w-full"
                        />
                    </div>
                )} */}
            </div>
        </div>
    );
}