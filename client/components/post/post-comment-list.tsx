"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostMainCommentItem } from "./post-main-comment-item";
import { getPostComments, addMainCommentToPost } from "@/api/post";
import type { MainComment } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import { cn } from "@/lib/utils";

interface PostCommentListProps {
    postId: string;
    onCommentUpdate?: () => void;
    className?: string;
}

export function PostCommentList({ postId, onCommentUpdate, className }: PostCommentListProps) {
    const [comments, setComments] = useState<MainComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const { user } = useAuth();
    const { showError } = useErrorDialog();
    const { showSuccess } = useSuccessDialog();

    useEffect(() => {
        loadComments(1);
    }, [postId]);

    const loadComments = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await getPostComments(postId, page, pagination.limit);

            if (response.code === 200) {
                if (page === 1) {
                    setComments(response.data.comments);
                } else {
                    setComments(prev => [...prev, ...response.data.comments]);
                }
                setPagination({
                    ...response.data.pagination,
                    totalPages: response.data.pagination.pages
                });
            } else {
                showError({
                    code: response.code,
                    title: "load comments failed",
                    msg: response.msg
                });
            }
        } catch (error) {
            showError({
                code: 500,
                title: "load comments failed",
                msg: "please try again later"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const response = await addMainCommentToPost(postId, {
                content: newComment
            });

            if (response.code === 200) {
                setNewComment("");
                showSuccess({
                    title: "comment!",
                    msg: "your comment has been posted"
                });
                setComments(prev => [response.data, ...prev]);
                onCommentUpdate?.();
            } else {
                showError({
                    code: response.code,
                    title: "comment failed",
                    msg: response.msg
                });
            }
        } catch (error) {
            showError({
                code: 500,
                title: "comment failed",
                msg: "please try again later"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoadMore = () => {
        if (pagination.page < pagination.totalPages) {
            loadComments(pagination.page + 1);
        }
    };

    const handleCommentUpdate = () => {
        loadComments(1);
        onCommentUpdate?.();
    };

    return (
        <div className={cn("flex flex-col", className)}>
            {user && (
                <form onSubmit={handleAddComment} className="mb-4 pb-4 border-b">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={user.userImg} alt={user.userName} sizes="32px" quality={85} />
                            <AvatarFallback>{user.userName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="say something..."
                                className="w-full px-3 py-2 bg-muted/50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                                disabled={isSubmitting}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey && newComment.trim()) {
                                        e.preventDefault();
                                        handleAddComment(e);
                                    }
                                }}
                            />
                        </div>
                        {newComment.trim() && (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                size="sm"
                                className="rounded-full"
                            >
                                Send
                            </Button>
                        )}
                    </div>
                </form>
            )}

            <div className="space-y-0">
                {loading && comments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No comments yet</p>
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <PostMainCommentItem
                                key={comment._id}
                                comment={comment}
                                onCommentUpdate={handleCommentUpdate}
                            />
                        ))}

                        {pagination.page < pagination.totalPages && (
                            <div className="text-center py-4 border-t">
                                <Button
                                    variant="ghost"
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    size="sm"
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    {loading ? "Loading..." : `Load more comments (${pagination.total - comments.length})`}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
