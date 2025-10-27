"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { dateFormat } from "@/lib/date";
import {
    addReplyCommentToPost,
    deleteMainCommentFromPost,
    deleteReplyCommentFromPost,
} from "@/api/post";
import type { MainComment } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";

interface PostMainCommentItemProps {
    comment: MainComment;
    onCommentUpdate: () => void;
}

export function PostMainCommentItem({
    comment,
    onCommentUpdate,
}: PostMainCommentItemProps) {
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeReplyTargetId, setActiveReplyTargetId] = useState<string | null>(
        null
    );
    const { user } = useAuth();
    const { showError } = useErrorDialog();
    const { showSuccess } = useSuccessDialog();

    // 提交回复
    const handleReplySubmit = async (
        e: React.FormEvent,
        receiveUserId: string,
        receiverName: string
    ) => {
        e.preventDefault();
        if (!replyContent.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const response = await addReplyCommentToPost(comment._id, {
                receiveUserId,
                content: replyContent,
            });

            if (response.code === 200) {
                setReplyContent("");
                setActiveReplyTargetId(null);
                showSuccess({
                    title: "reply success",
                    msg: "your reply has been published",
                });
                onCommentUpdate();
            } else {
                showError({
                    code: response.code,
                    title: "reply failed",
                    msg: response.msg,
                });
            }
        } catch (error) {
            showError({
                code: 500,
                title: "reply failed",
                msg: "please try again later",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 删除主评论
    const handleDeleteMainComment = async () => {
        if (
            !confirm("are you sure to delete this comment? this action cannot be undone.")
        )
            return;

        try {
            const response = await deleteMainCommentFromPost(comment._id);
            if (response.code === 200) {
                showSuccess({
                    title: "delete success",
                    msg: "comment has been deleted",
                });
                onCommentUpdate();
            } else {
                showError({
                    code: response.code,
                    title: "delete failed",
                    msg: response.msg,
                });
            }
        } catch (error) {
            showError({
                code: 500,
                title: "delete failed",
                msg: "please try again later",
            });
        }
    };

    // 删除回复评论
    const handleDeleteReply = async (replyId: string) => {
        if (
            !confirm("are you sure to delete this reply? this action cannot be undone.")
        )
            return;

        try {
            const response = await deleteReplyCommentFromPost(replyId);
            if (response.code === 200) {
                showSuccess({
                    title: "delete success",
                    msg: "reply has been deleted",
                });
                onCommentUpdate();
            } else {
                showError({
                    code: response.code,
                    title: "delete failed",
                    msg: response.msg,
                });
            }
        } catch (error) {
            showError({
                code: 500,
                title: "delete failed",
                msg: "please try again later",
            });
        }
    };

    return (
        <div className="py-4 border-b">
            {/* 主评论 */}
            <div className="flex gap-3">
                <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={comment.userImg} alt={comment.userName} sizes="36px" quality={85} />
                    <AvatarFallback>{comment.userName?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    {/* 用户名 */}
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        {user?.id === comment.userId.toString() && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-muted-foreground hover:text-destructive"
                                onClick={handleDeleteMainComment}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>

                    {/* 评论内容 */}
                    <p className="text-sm mb-2 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>

                    {/* 时间和回复按钮 */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <span>{dateFormat(comment.createdAt)}</span>
                        {comment.replies && comment.replies.length > 0 && (
                            <span>{comment.replies.length} replies</span>
                        )}
                        {user && (
                            <button
                                className="hover:text-foreground transition-colors"
                                onClick={() => {
                                    if (activeReplyTargetId === comment._id) {
                                        setActiveReplyTargetId(null);
                                        setReplyContent("");
                                    } else {
                                        setActiveReplyTargetId(comment._id);
                                        setReplyContent("");
                                    }
                                }}
                            >
                                Reply
                            </button>
                        )}
                    </div>

                    {/* 回复输入框（回复主评论） */}
                    {activeReplyTargetId === comment._id && (
                        <form
                            onSubmit={(e) =>
                                handleReplySubmit(e, comment.userId.toString(), comment.userName)
                            }
                            className="mb-3"
                        >
                            <div className="flex items-start gap-2">
                                <Avatar className="h-7 w-7 flex-shrink-0">
                                    <AvatarImage src={user?.userImg} alt={user?.userName} sizes="28px" quality={85} />
                                    <AvatarFallback>{user?.userName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <input
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder={`@ ${comment.userName}...`}
                                        className="w-full px-3 py-1.5 text-sm bg-muted/50 rounded-full focus:outline-none focus:ring-1 focus:ring-accent"
                                        disabled={isSubmitting}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey && replyContent.trim()) {
                                                e.preventDefault();
                                                handleReplySubmit(e, comment.userId.toString(), comment.userName);
                                            }
                                            if (e.key === 'Escape') {
                                                setActiveReplyTargetId(null);
                                                setReplyContent("");
                                            }
                                        }}
                                    />
                                    <div className="flex justify-end gap-2 mt-1.5">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => {
                                                setActiveReplyTargetId(null);
                                                setReplyContent("");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="h-7 text-xs rounded-full"
                                            disabled={!replyContent.trim() || isSubmitting}
                                        >
                                            {isSubmitting ? "Sending..." : "Send"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* 回复列表 */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-3 pl-3 border-l-2 border-muted">
                            {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex gap-3">
                                    <Avatar className="h-7 w-7 flex-shrink-0">
                                        <AvatarImage src={reply.senderImg} alt={reply.senderName} sizes="28px" quality={85} />
                                        <AvatarFallback>{reply.senderName?.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        {/* 回复者信息 */}
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1.5 text-sm flex-wrap">
                                                <span className="font-medium">{reply.senderName}</span>
                                                <span className="text-muted-foreground text-xs">replied to</span>
                                                <span className="font-medium text-accent">{reply.receiverName}</span>
                                            </div>
                                            {user?.id === reply.sendUserId.toString() && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 px-2 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDeleteReply(reply._id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* 回复内容 */}
                                        <p className="text-sm mb-1.5 whitespace-pre-wrap break-words">
                                            {reply.content}
                                        </p>

                                        {/* 时间和回复按钮 */}
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>{dateFormat(reply.createdAt)}</span>
                                            {user && (
                                                <button
                                                    className="hover:text-foreground transition-colors"
                                                    onClick={() => {
                                                        if (activeReplyTargetId === reply._id) {
                                                            setActiveReplyTargetId(null);
                                                            setReplyContent("");
                                                        } else {
                                                            setActiveReplyTargetId(reply._id);
                                                            setReplyContent("");
                                                        }
                                                    }}
                                                >
                                                    Reply
                                                </button>
                                            )}
                                        </div>

                                        {/* 回复输入框（回复二级评论） */}
                                        {activeReplyTargetId === reply._id && (
                                            <form
                                                onSubmit={(e) =>
                                                    handleReplySubmit(e, reply.sendUserId.toString(), reply.senderName)
                                                }
                                                className="mt-2"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <Avatar className="h-6 w-6 flex-shrink-0">
                                                        <AvatarImage src={user?.userImg} alt={user?.userName} sizes="24px" quality={85} />
                                                        <AvatarFallback className="text-xs">{user?.userName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <input
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder={`Reply to ${reply.senderName}...`}
                                                            className="w-full px-3 py-1 text-xs bg-muted/50 rounded-full focus:outline-none focus:ring-1 focus:ring-accent"
                                                            disabled={isSubmitting}
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && !e.shiftKey && replyContent.trim()) {
                                                                    e.preventDefault();
                                                                    handleReplySubmit(e, reply.sendUserId.toString(), reply.senderName);
                                                                }
                                                                if (e.key === 'Escape') {
                                                                    setActiveReplyTargetId(null);
                                                                    setReplyContent("");
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex justify-end gap-2 mt-1.5">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 text-xs"
                                                                onClick={() => {
                                                                    setActiveReplyTargetId(null);
                                                                    setReplyContent("");
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                size="sm"
                                                                className="h-6 text-xs rounded-full"
                                                                disabled={!replyContent.trim() || isSubmitting}
                                                            >
                                                                {isSubmitting ? "Sending..." : "Send"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
