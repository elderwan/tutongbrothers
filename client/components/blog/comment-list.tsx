"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainCommentItem } from "./main-comment-item";
import { MainComment, getBlogComments, addMainComment } from "@/api/comment";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import { cn } from "@/lib/utils";
import { io, Socket } from "socket.io-client";

interface CommentListProps {
    blogId: string;
    onCommentUpdate?: () => void;
    className?: string;
}

export function CommentList({ blogId, onCommentUpdate, className }: CommentListProps) {
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

    // WebSocket 连接与轮询定时器引用
    const socketRef = useRef<Socket | null>(null);
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const WS_URL = "http://localhost:5000"; // 与后端同源（非 /api）

    // 加载评论（REST 回退与初次加载）
    const loadComments = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await getBlogComments(blogId, page, pagination.limit);

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

    // 根据推送插入主评论或回复，避免重复并保持顺序
    const upsertByPush = (payload: { type: "main" | "reply"; data: any }) => {
        setComments((prev) => {
            if (payload.type === "main") {
                const main: MainComment = payload.data;
                // 去重：如果已存在则不重复插入
                if (prev.some(c => c._id === main._id)) return prev;
                // 插入到顶部（最新在前）
                const next = [main, ...prev];
                return next;
            } else {
                const reply = payload.data as any;
                const parentId = reply.parentId;
                // 如果父主评不存在（可能在分页未加载），忽略，等待 REST 初始加载时再显示
                const idx = prev.findIndex(c => c._id === parentId);
                if (idx === -1) return prev;
                const target = prev[idx];
                const replies = target.replies || [];
                if (replies.some(r => r._id === reply._id)) return prev;
                const nextReplies = [reply, ...replies];
                const nextTarget = { ...target, replies: nextReplies };
                const next = [...prev];
                next[idx] = nextTarget;
                return next;
            }
        });
    };

    // 建立与管理 WebSocket 连接
    useEffect(() => {
        let stopPolling = false;
        // 初次加载 REST 数据
        loadComments(1);

        // 建立 socket 连接
        try {
            socketRef.current = io(WS_URL, {
                transports: ["websocket"],
                withCredentials: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            // 加入房间
            socketRef.current.emit("comment:join", { blogId });

            // 监听服务端推送的新评论
            socketRef.current.on("comment:new", upsertByPush);

            // 连接错误与回退：当连接失败时启动轻量轮询（每 10s 刷新第一页，直到连接恢复）
            const startPolling = () => {
                if (stopPolling) return;
                if (pollTimerRef.current) return; // 已有轮询在运行
                pollTimerRef.current = setInterval(() => {
                    if (socketRef.current && socketRef.current.connected) {
                        if (pollTimerRef.current) {
                            clearInterval(pollTimerRef.current);
                            pollTimerRef.current = null;
                        }
                        return;
                    }
                    loadComments(1);
                }, 10000);
            };

            socketRef.current.on("connect_error", startPolling);
            socketRef.current.on("reconnect_error", startPolling);
            socketRef.current.on("reconnect_failed", startPolling);
        } catch (err) {
            // 若初始化失败，进行回退轮询
            pollTimerRef.current = setInterval(() => loadComments(1), 10000);
        }

        // 清理函数：离开页面或 blogId 变化时，离房间并断开连接
        return () => {
            stopPolling = true;
            // 清理轮询
            if (pollTimerRef.current) {
                clearInterval(pollTimerRef.current);
                pollTimerRef.current = null;
            }
            try {
                if (socketRef.current) {
                    socketRef.current.emit("comment:leave", { blogId });
                    socketRef.current.off("comment:new", upsertByPush as any);
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            } catch { }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId]);

    // 添加主评论
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const response = await addMainComment(blogId, {
                userId: user.id as string,
                content: newComment
            });

            if (response.code === 200) {
                setNewComment("");
                showSuccess({
                    title: "comment!",
                    msg: "your comment has been posted"
                });
                // 不再强制刷新列表，等待 WebSocket 推送；作为兜底，插入本地（避免服务器延迟）
                upsertByPush({ type: "main", data: response.data });
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

    // 加载更多评论
    const loadMoreComments = () => {
        if (pagination.page < pagination.totalPages) {
            loadComments(pagination.page + 1);
        }
    };

    // 评论更新回调（保留原逻辑）
    const handleCommentUpdate = () => {
        loadComments(1);
        onCommentUpdate?.();
    };

    useEffect(() => {
        loadComments();
    }, [blogId]);

    return (
        <div className={cn("space-y-4 max-w-4xl  w-full mx-auto", className)}>
            {/* 添加评论表单 */}
            {user && (
                <form onSubmit={handleAddComment} className="flex w-full items-center space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={user.userImg} alt={user.userName} />
                        <AvatarFallback>{user?.userName ? user?.userName.charAt(0) : "T"}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full bg-[#F9F5F0] border rounded-full px-4 py-2 text-sm 
                              focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="shrink-0"
                        >
                            {isSubmitting ? "posting..." : "post"}
                        </Button>
                    </div>
                </form>

            )}

            {/* 评论列表 */}
            {loading && comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    loading the all comments...
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    no comments yet！
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <MainCommentItem
                            key={comment._id}
                            comment={comment}
                            onCommentUpdate={handleCommentUpdate}
                        />
                    ))}

                    {/* 加载更多按钮 */}
                    {pagination.page < pagination.totalPages && (
                        <div className="text-center">
                            <Button
                                variant="outline"
                                onClick={loadMoreComments}
                                disabled={loading}
                            >
                                {loading ? "loading more comments..." : "load more comments"}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* 评论统计 */}
            {pagination.total > 0 && (
                <div className="text-center text-sm text-gray-500 pt-4 border-t">
                    total {pagination.total} comments
                </div>
            )}
        </div>
    );
}