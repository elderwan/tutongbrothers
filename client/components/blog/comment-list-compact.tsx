"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainCommentItem } from "./main-comment-item";
import { MainComment, getBlogComments, addMainComment } from "@/api/comment";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import { cn } from "@/lib/utils";

interface CommentListCompactProps {
  blogId: string;
  onCommentUpdate?: () => void;
  className?: string;
}

export function CommentListCompact({ blogId, onCommentUpdate, className }: CommentListCompactProps) {
  const [comments, setComments] = useState<MainComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5, // 紧凑模式单页显示更少的主评论
    total: 0,
    totalPages: 0,
  });

  const { user } = useAuth();
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();

  const loadComments = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getBlogComments(blogId, page, pagination.limit);
      if (response.code === 200) {
        if (page === 1) {
          setComments(response.data.comments);
        } else {
          setComments((prev) => [...prev, ...response.data.comments]);
        }
        setPagination(response.data.pagination);
      } else {
        showError({ code: response.code, title: "load comments failed", msg: response.msg });
      }
    } catch (error) {
      showError({ code: 500, title: "load comments failed", msg: "please try again later" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const response = await addMainComment(blogId, {
        userId: user.id as string,
        content: newComment,
      });
      if (response.code === 200) {
        setNewComment("");
        showSuccess({ title: "comment!", msg: "your comment has been posted" });
        loadComments(1);
        onCommentUpdate?.();
      } else {
        showError({ code: response.code, title: "comment failed", msg: response.msg });
      }
    } catch (error) {
      showError({ code: 500, title: "comment failed", msg: "please try again later" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMoreComments = () => {
    if (pagination.page < pagination.totalPages) {
      loadComments(pagination.page + 1);
    }
  };

  const handleCommentUpdate = () => {
    loadComments(1);
    onCommentUpdate?.();
  };

  useEffect(() => {
    loadComments();
  }, [blogId]);

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {/* 紧凑模式的添加评论行 */}
      {user && (
        <form onSubmit={handleAddComment} className="flex w-full items-center space-x-2">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={user.userImg} alt={user.userName} />
            <AvatarFallback>{user?.userName ? user?.userName.charAt(0) : "T"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center space-x-2">
            <input
              type="text"
              placeholder="write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={isSubmitting || !newComment.trim()} size="sm" className="h-6 px-3 text-xs">
              {isSubmitting ? "posting..." : "post"}
            </Button>
          </div>
        </form>
      )}

      {/* 紧凑模式的评论列表 */}
      {loading && comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-xs">loading the all comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-xs">no comments yet！</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <MainCommentItem key={comment._id} comment={comment} onCommentUpdate={handleCommentUpdate} compact />
          ))}

          {pagination.page < pagination.totalPages && (
            <div className="text-center">
              <Button variant="outline" onClick={loadMoreComments} disabled={loading} size="sm" className="h-7 px-3 text-xs">
                {loading ? "loading more comments..." : "load more comments"}
              </Button>
            </div>
          )}
        </div>
      )}

      {pagination.total > 0 && (
        <div className="text-center text-[11px] text-gray-500 pt-3 border-t">total {pagination.total} comments</div>
      )}
    </div>
  );
}