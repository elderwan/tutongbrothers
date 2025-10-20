"use client";

import { useRouter } from "next/navigation";
import { Heart, MessageCircle, Eye, Calendar } from "lucide-react";
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
    tags
}: BlogCardHorizontalProps) {
    const router = useRouter();

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

    return (
        <div
            className="border-b p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleClick}
        >
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
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Cover Image */}
                {coverImage && (
                    <div className="w-24 h-24 flex-shrink-0">
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
