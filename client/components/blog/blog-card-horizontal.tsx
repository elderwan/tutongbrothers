"use client";

import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Eye, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { deleteBlog } from "@/api/blog";
import { dateFormat } from "@/lib/date";

interface BlogCardHorizontalProps {
    id: string;
    title: string;
    content: string;
    coverImage?: string;
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    createdAt: string;
    likes: number;
    comments: number;
    views: number;
    tags?: string[];
    onDeleted?: (blogId: string) => void;
}

export function BlogCardHorizontal({
    id,
    title,
    content,
    coverImage,
    author,
    createdAt,
    likes,
    comments,
    views,
    tags,
    onDeleted
}: BlogCardHorizontalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { showConfirm } = useConfirmDialog();
    const { showSuccess } = useSuccessDialog();
    const { showError } = useErrorDialog();

    const isAuthor = !!user?.id && user.id === author.id;

    // Extract plain text from markdown/HTML content
    const getPlainText = (text: string) => {
        return text
            .replace(/<[^>]*>/g, '')
            .replace(/[#*`]/g, '')
            .substring(0, 150);
    };

    const handleClick = () => {
        router.push(`/blog/${id}`);
    };

    const handleDelete = async () => {
        try {
            const response = await deleteBlog(id);
            if (response.code === 200) {
                showSuccess({
                    title: "Delete Blog",
                    msg: "Blog deleted successfully",
                    onConfirm: () => { }
                });
                if (onDeleted) onDeleted(id);
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
                title: "Error",
                msg: "Failed to delete blog"
            });
        }
    };

    return (
        <div
            className="border-b p-4 hover:bg-gray-50 cursor-pointer transition-colors relative"
            onClick={handleClick}
        >
            {/* Delete button - Top left */}
            {isAuthor && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-cream z-10"
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
                    <X className="h-3.5 w-3.5" />
                </Button>
            )}
            <div className="flex gap-3">
                {/* Left: Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">
                        {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {getPlainText(content)}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {dateFormat(createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {comments}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {views}
                        </span>
                    </div>

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Cover Image */}
                {coverImage && (
                    <div className="mr-6 w-24 h-24 flex-shrink-0">
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
