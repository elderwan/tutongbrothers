"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Reply, Trash2 } from "lucide-react";
import { dateFormat } from "@/lib/date";
import {
    MainComment,
    addReplyComment,
    deleteMainComment,
    deleteReplyComment,
} from "@/api/comment";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";

interface MainCommentItemProps {
    comment: MainComment;
    onCommentUpdate: () => void;
    compact?: boolean;
}

export function MainCommentItem({
    comment,
    onCommentUpdate,
    compact = false,
}: MainCommentItemProps) {
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeReplyTargetId, setActiveReplyTargetId] = useState<string | null>(
        null
    ); // ✅ 记录在哪条评论下回复
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
            const response = await addReplyComment(comment._id, {
                sendUserId: user.id as string,
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
                // 依赖 WebSocket 推送更新界面，不再触发父组件刷新
                // onCommentUpdate();
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
            const response = await deleteMainComment(comment._id);
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

    // 删除子评论
    const handleDeleteReply = async (replyId: string) => {
        if (
            !confirm("are you sure to delete this reply? this action cannot be undone.")
        )
            return;

        try {
            const response = await deleteReplyComment(replyId);
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

    // 渲染回复表单
    const renderReplyForm = (targetId: string, receiveUserId: string, receiverName: string) => {
        if (activeReplyTargetId !== targetId) return null;
        return (
            <form
                onSubmit={(e) => handleReplySubmit(e, receiveUserId, receiverName)}
                className="mt-2 flex space-x-2"
            >
                <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={user?.userImg} alt="Your avatar" />
                    <AvatarFallback>{user?.userName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                    <input
                        type="text"
                        placeholder={`reply to ${receiverName}...`}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="flex-1 border rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="h-6 px-3 text-xs"
                        disabled={isSubmitting || !replyContent.trim()}
                    >
                        {isSubmitting ? "sending..." : "send"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 px-3 text-xs"
                        onClick={() => {
                            setActiveReplyTargetId(null);
                            setReplyContent("");
                        }}
                        disabled={isSubmitting}
                    >
                        cancel
                    </Button>
                </div>
            </form>
        );
    };


    return (
        <div className="mb-4">
            {/* 主评论 */}
            <div className="flex space-x-3">
                <Avatar className={`flex-shrink-0 ${compact ? "h-7 w-7" : "h-10 w-10"}`}>
                    <AvatarImage src={comment.userImg} alt={comment.userName} />
                    <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className={compact ? "bg-cream rounded-lg p-2" : "bg-cream rounded-lg p-3"}>
                        <div className="flex items-baseline justify-between mb-1">
                            <div className="flex items-baseline space-x-2">
                                <p className={compact ? "font-semibold text-xs" : "font-semibold text-sm"}>{comment.userName}</p>
                                <p className={compact ? "text-[11px] text-gray-500" : "text-xs text-gray-500"}>
                                    {dateFormat(comment.createdAt)}
                                </p>
                            </div>
                            {user && user.id === comment.userId && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={compact ? "h-5 w-5 p-0 text-gray-400 hover:text-red-500" : "h-6 w-6 p-0 text-gray-400 hover:text-red-500"}
                                    onClick={handleDeleteMainComment}
                                >
                                    <Trash2 className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
                                </Button>
                            )}
                        </div>
                        <p className={compact ? "text-gray-800 text-xs leading-snug" : "text-gray-800 text-sm leading-relaxed"}>
                            {comment.content}
                        </p>
                    </div>

                    {/* 主评论回复按钮 */}
                    {user && (
                        <div className="mt-1">
                            {/* 主评论回复按钮 */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className={compact ? "text-gray-600 hover:text-gray-800 h-5 px-1 text-[11px]" : "text-gray-600 hover:text-gray-800 h-6 px-2 text-xs"}
                                onClick={() => {
                                    if (activeReplyTargetId === comment._id) {
                                        // 如果已经展开，再点一次就收起
                                        setActiveReplyTargetId(null);
                                        setReplyContent("");
                                    } else {
                                        // 切换到新的输入框
                                        setActiveReplyTargetId(comment._id);
                                        setReplyContent("");
                                    }
                                }}
                            >
                                <Reply className="h-3 w-3 mr-1" />
                                reply
                            </Button>
                        </div>
                    )}

                    {/* 主评论下的回复表单 */}
                    {renderReplyForm(comment._id, comment.userId, comment.userName)}

                    {/* 回复列表 */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex space-x-2">
                                    <Avatar className="h-6 w-6 flex-shrink-0">
                                        <AvatarImage src={reply.senderImg} alt={reply.senderName} />
                                        <AvatarFallback>{reply.senderName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-baseline justify-between mb-1">
                                                <div className="flex items-baseline space-x-1">
                                                    <span className="font-medium text-xs text-blue-600">
                                                        {reply.senderName}
                                                    </span>
                                                    <span className="text-xs text-gray-500">@</span>
                                                    <span className="font-medium text-xs text-green-600">
                                                        {reply.receiverName}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {dateFormat(reply.createdAt)}
                                                    </span>
                                                </div>
                                                {user && user.id === reply.sendUserId && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-4 w-4 p-0 text-gray-400 hover:text-red-500"
                                                        onClick={() => handleDeleteReply(reply._id)}
                                                    >
                                                        <Trash2 className="h-2 w-2" />
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-gray-700 text-xs leading-relaxed">
                                                {reply.content}
                                            </p>
                                        </div>

                                        {/* 子评论的回复按钮 */}
                                        {user && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-500 hover:text-gray-700 h-5 px-1 text-xs mt-1"
                                                onClick={() => {
                                                    if (activeReplyTargetId === reply._id) {
                                                        setActiveReplyTargetId(null);
                                                        setReplyContent("");
                                                    } else {
                                                        setActiveReplyTargetId(reply._id);
                                                        // setReplyContent(`@${reply.senderName} `);
                                                        setReplyContent("");
                                                    }
                                                }}
                                            >
                                                <Reply className="h-2 w-2 mr-1" />
                                                reply
                                            </Button>

                                        )}

                                        {/* 子评论下的回复表单 */}
                                        {renderReplyForm(reply._id, reply.sendUserId, reply.senderName)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
