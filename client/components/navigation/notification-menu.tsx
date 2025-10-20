"use client"

import { useState } from "react"
import { BellIcon, MessageSquareText } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect } from "react";
import { getNotifications, markNotificationRead, markAllNotificationsRead, NotificationItem } from "@/api/notification";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { useRouter } from "next/navigation";

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useAuthDialog();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const router = useRouter();

  // 分页状态：初始仅展示20条
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // 轻量实时刷新：仅当弹层打开时开始轮询
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) return;
    // 首次加载
    getNotifications(1, limit).then(res => {
      if (res.code === 200) {
        setNotifications(res.data.items);
        setPage(res.data.pagination.page);
        setTotalPages(res.data.pagination.pages);
      }
    }).catch(err => console.error("Failed to load notifications", err));
  }, [isAuthenticated, limit]);

  useEffect(() => {
    if (!isAuthenticated || !open) return;
    const interval = setInterval(async () => {
      try {
        const res = await getNotifications(1, limit);
        if (res.code === 200) {
          // 将最新一页合并到现有列表顶部，避免丢失已加载的旧页
          const newItems = res.data.items;
          setNotifications((prev) => {
            const mergedTop = [...newItems, ...prev.filter(p => !newItems.find(n => n._id === p._id))];
            return mergedTop;
          });
          setTotalPages(res.data.pagination.pages);
        }
      } catch (e) { /* ignore */ }
    }, 10000); // 每10秒刷新一次
    return () => clearInterval(interval);
  }, [isAuthenticated, open, limit]);

  const handleMarkAllAsRead = async () => {
    if (!isAuthenticated) { openSignIn(); return; }
    try {
      const res = await markAllNotificationsRead();
      if (res.code === 200) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) { console.error(err); }
  }

  const handleNotificationClick = async (id: string, item?: NotificationItem) => {
    if (!isAuthenticated) { openSignIn(); return; }
    try {
      const res = await markNotificationRead(id);
      if (res.code === 200) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        // 跳转逻辑
        if (item) {
          if (item.type === 'new_blog' && item.blogId) {
            router.push(`/blog/${item.blogId}`);
          } else if (item.type === 'reply' && item.blogId) {
            router.push(`/blog/${item.blogId}`);
          } else if (item.type === 'follow' && item.senderId) {
            router.push(`/blog`); // 暂无用户主页，先跳转到博客列表
          }
        }
      }
    } catch (err) { console.error(err); }
  }

  const handleLoadMore = async () => {
    if (!isAuthenticated) { openSignIn(); return; }
    if (loadingMore) return;
    const nextPage = page + 1;
    if (nextPage > totalPages) return;
    setLoadingMore(true);
    try {
      const res = await getNotifications(nextPage, limit);
      if (res.code === 200) {
        const newItems = res.data.items;
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n._id));
          const appendOnly = newItems.filter(it => !existingIds.has(it._id));
          return [...prev, ...appendOnly];
        });
        setPage(nextPage);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) { console.error(err); }
    finally { setLoadingMore(false); }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="Open notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-90 p-1 max-h-[66vh] overflow-hidden">
        <ScrollArea className="max-h-[50vh] sm:max-h-[66vh] rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <div className="flex items-baseline justify-between gap-4 px-3 py-2">
            <div className="text-sm font-semibold">Notifications</div>
            {unreadCount > 0 && (
              <button
                className="text-xs font-medium hover:underline"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div
            role="separator"
            aria-orientation="horizontal"
            className="bg-border -mx-1 my-1 h-fit"
          ></div>
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
            >
              <div className="relative flex items-start pe-3">
                <div className="flex-1 space-y-1">
                  <button
                    className="text-foreground/80 text-left after:absolute after:inset-0"
                    onClick={() => handleNotificationClick(notification._id, notification)}
                  >
                    {/* 标题行：消息摘要 */}
                    <span className="text-foreground font-medium hover:underline inline-flex items-center gap-1 w-full">
                      {notification.type === 'reply' && <MessageSquareText className="size-3.5" aria-hidden />}
                      <span className="line-clamp-2 break-words">
                        {notification.message || notification.type}
                      </span>
                    </span>
                  </button>
                  {/* 回复通知中的被回复评论内容（最多两行，超出省略） */}
                  {notification.type === 'reply' && (
                    <div className="text-muted-foreground/90 text-xs">
                      <div className="bg-muted/40 text-muted-foreground rounded-md px-2 py-1 w-full">
                        <span className="line-clamp-2 break-words">
                          {notification.commentContent ?? '...'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="text-muted-foreground text-xs">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="absolute end-0 self-center">
                    <span className="sr-only">Unread</span>
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          ))}
          {page < totalPages && (
            <div className="px-3 py-2">
              <button
                className="w-full text-center text-xs text-muted-foreground hover:underline"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'click to load more notifications'}
              </button>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  )
}
