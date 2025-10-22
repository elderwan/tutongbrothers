"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Reply } from "lucide-react";
import { dateFormat } from "@/lib/date";

interface Comment {
    _id: string;
    userId: string;
    userName: string;
    userImg: string;
    content: string;
    parentId?: string;
    replies?: Comment[];
    createdAt: string;
}

interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: string, content: string) => void;
    isReply?: boolean;
    currentUserId?: string;
}

export default function CommentItem({
    comment,
    onReply,
    isReply = false,
    currentUserId
}: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyContent.trim()) {
            onReply(comment._id, replyContent);
            setReplyContent("");
            setShowReplyForm(false);
        }
    };

    return (
        <div
            id={`comment-${comment._id}`}
            className={`${isReply ? 'ml-6 border-l-2 border-gray-200 pl-3' : ''} mb-3 scroll-mt-20`}
        >
            <div className="flex space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.userImg} alt={comment.userName} />
                    <AvatarFallback>{comment?.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="bg-cream rounded-lg p-3">
                        <div className="flex items-baseline space-x-2 mb-1">
                            <p className="font-semibold text-sm">{comment.userName}</p>
                            <p className="text-xs text-gray-500">
                                {dateFormat(comment.createdAt)}
                            </p>
                            <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
                        </div>

                    </div>

                    {/* Reply button - show for all comments if user is authenticated */}
                    {currentUserId && (
                        <div className="mt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-gray-800 h-6 px-2 text-xs"
                                onClick={() => {
                                    setShowReplyForm(!showReplyForm);
                                }}
                            >
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                            </Button>
                        </div>
                    )}

                    {/* Reply form */}
                    {showReplyForm && (
                        <form onSubmit={handleReplySubmit} className="mt-2 flex space-x-2">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage src="/avatar/mx96.jpg" alt="Your avatar" />
                                <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex space-x-2">
                                <input
                                    type="text"
                                    placeholder={`Reply to ${comment.userName}...`}
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="flex-1 border rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button type="submit" size="sm" className="h-6 px-3 text-xs">Reply</Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => setShowReplyForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            onReply={onReply}
                            isReply={true}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}