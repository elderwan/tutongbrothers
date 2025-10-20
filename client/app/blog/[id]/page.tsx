"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { getBlogById, likeBlog, incrementBlogViews } from "@/api/blog";
import { getBlogComments } from "@/api/comment";
import { use } from "react";
import { useErrorDialog } from '@/components/dialogs/error-dialog';
import { useSuccessDialog } from '@/components/dialogs/success-dialog';
import markdownit from 'markdown-it'
import { dateFormat } from "@/lib/date";
import { useAuth } from '@/contexts/AuthContext';
import ImageGallery from '@/components/blog/image-gallery';
import { CommentList } from '@/components/blog/comment-list';
import SigninDialog from "@/components/auth/signin-dialog"; // 你自己的登录对话框组件
import { getFollowStatus, followUser as followUserApi, unfollowUser as unfollowUserApi } from "@/api/follow";
import { json } from "stream/consumers";
import { Blog as ApiBlog, BlogAuthor } from '@/api/blog'

type Blog = ApiBlog;

// 定义评论类型

const md = markdownit();


export default function BlogDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);
    const blogId = params.id;
    const { showSuccess } = useSuccessDialog();
    const { showError } = useErrorDialog();
    const [parseContent, setParseContent] = useState<string | null>(null);
    const { user, isAuthenticated } = useAuth();
    const [showSignIn, setShowSignIn] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const viewCountedRef = useRef(false); // 用于防止重复计数
    const viewTimerRef = useRef<NodeJS.Timeout | null>(null); // 用于存储定时器

    console.log("blogId:", params);
    console.log("id", blogId)
    // 获取博客详情
    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const res = await getBlogById(blogId);
                console.log("getBlogById res:", res);
                const blogData: Blog = res.data;
                if (res.code === 200) {
                    setBlog(blogData);
                    setLikesCount(res.data.likes.length);
                    setParseContent(md.render(blogData?.content || ''));
                    // 加载评论数量
                    loadCommentsCount(blogData._id);

                }
            } catch (error) {
                setBlog(null);
                showError({
                    code: 500,
                    title: "unknown error with blog detail",
                    msg: "pls try agian later"
                });
                console.error("Failed to fetch blog:", error);
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    // 浏览量计数：停留5秒后触发
    useEffect(() => {
        if (!blog || viewCountedRef.current) return;

        // 获取博主ID（userId 可能是字符串或对象）
        const authorId = typeof blog.userId === 'string' ? blog.userId : blog.userId?._id;

        if (authorId && user && authorId === user.id) {
            return; // 博主本人浏览不计入浏览量
        }

        // 设置5秒定时器
        viewTimerRef.current = setTimeout(async () => {
            try {
                // 传递当前用户ID（如果已登录）用于判断是否是博主本人
                const viewerId = user?.id;
                await incrementBlogViews(blog._id, viewerId);
                viewCountedRef.current = true; // 标记已计数
                console.log("Blog view incremented");
            } catch (error) {
                console.error("Failed to increment blog views:", error);
            }
        }, 5000); // 5秒后执行

        // 清理函数：组件卸载时清除定时器
        return () => {
            if (viewTimerRef.current) {
                clearTimeout(viewTimerRef.current);
                viewTimerRef.current = null;
            }
        };
    }, [blog, user]);


    // 加载评论数量
    const loadCommentsCount = async (blogId: string) => {
        try {
            const response = await getBlogComments(blogId, 1, 99);
            if (response.code === 200) {
                setCommentsCount(response.data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to load comments count:", error);
        }
    };

    // 评论更新回调
    const handleCommentUpdate = () => {
        if (blog) {
            loadCommentsCount(blog._id);
        }
    };

    useEffect(() => {
        if (blog && isAuthenticated) {
            // 初始化点赞状态
            if (user && blog.likes.includes(user.id as string)) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
            // 拉取关注状态
            const authorId = typeof blog.userId === 'string' ? blog.userId : blog.userId._id;
            if (authorId && user && user.id !== authorId) {
                getFollowStatus(authorId)
                    .then(res => {
                        if (res.code === 200) {
                            setIsFollowing(!!res.data?.isFollowing);
                        }
                    })
                    .catch(err => console.error("Failed to get follow status", err));
            }
        }
    }, [blog, user, isAuthenticated]);


    // 处理点赞
    const handleLike = async () => {
        if (!isAuthenticated || !user) {
            showError({
                code: 401,
                title: "Authentication Required",
                msg: "Please login to like this blog"
            });
            return;
        }

        try {
            const userId = user.id as string;
            const response = await likeBlog(blog!._id, userId);

            if (response.code === 200) {
                setLikesCount(response.data.likesCount);
                setIsLiked(!isLiked);
            }
        } catch (error) {
            console.error("Failed to like blog:", error);
        }
    };

    if (loading) {
        return <div className="px-2 md:px-20 2xl:px-60 py-8">Loading...</div>;
    }

    if (!blog) {
        return <div className="px-2 md:px-20 2xl:px-60 py-8">Blog not found</div>;
    }

    const handleFollowToggle = async () => {
        if (!isAuthenticated || !user) {
            setShowSignIn(true);
            return;
        }

        if (!blog?.userId) {
            return;
        }

        // 获取作者 ID
        const authorId = typeof blog.userId === 'string' ? blog.userId : blog.userId._id;

        console.log("target id", authorId);
        console.log("current user id", user.id);

        // 如果是自己的博客，不显示关注按钮
        if (user.id === authorId) {
            return;
        }

        try {
            setFollowLoading(true);
            if (isFollowing) {
                const res = await unfollowUserApi(authorId);
                if (res.code === 200) {
                    setIsFollowing(false);
                    showSuccess({ title: "Unfollowed", msg: "You have unfollowed the author" });
                }
            } else {
                const res = await followUserApi(authorId);
                if (res.code === 200) {
                    setIsFollowing(true);
                    showSuccess({ title: "Followed", msg: "You are now following the author" });
                } else {
                    showError({ code: res.code, title: "Operation failed", msg: res.msg });
                }
            }
        } catch (error) {
            showError({ code: 500, title: "Operation failed", msg: "Please try again later" });
        } finally {
            setFollowLoading(false);
        }
    };

    return (
        <>

            <div className="px-2 md:px-20 2xl:px-60 py-8">
                {/* 返回按钮 */}
                <Button
                    variant="ghost"
                    className="mb-6 flex items-center"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* 博客详情 */}
                <article className="max-w-4xl mx-auto">
                    {/* 作者信息 */}
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                        {/* 左侧：头像 + 用户信息 */}
                        <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-12 w-12 flex-shrink-0">
                                <AvatarImage
                                    src={typeof blog.userId === 'string' ? blog.userImg : blog.userId.userImg}
                                    alt={typeof blog.userId === 'string' ? blog.userName : blog.userId.userName}
                                />
                                <AvatarFallback>{blog.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                                <p className="font-semibold text-base truncate">{blog.userName}</p>
                                <p className="text-sm text-gray-500">{dateFormat(blog.createdAt)}</p>
                            </div>
                        </div>

                        {/* 右侧：Follow 按钮 - 只有当不是自己的博客时才显示 */}
                        {(() => {
                            const authorId = typeof blog.userId === 'string' ? blog.userId : blog.userId._id;
                            return blog.userId && user?.id !== authorId && (
                                <Button
                                    size="sm"
                                    variant={isFollowing ? "secondary" : "default"}
                                    onClick={handleFollowToggle}
                                    disabled={followLoading}
                                    className="ml-auto"
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                            );
                        })()}
                    </div>


                    {/* 标题 */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{blog.title}</h1>
                    {/* 博客类型移动到标题下方 */}
                    <div className="mb-6">
                        <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                            {blog.type}
                        </span>
                    </div>

                    {/* 图片画廊 */}
                    {blog.images && blog.images.length > 0 && (
                        <div className="mb-8">
                            <ImageGallery images={blog.images} title={blog.title} />
                        </div>
                    )}

                    {/* prose max-w-none */}

                    {/* 内容 */}
                    {parseContent ? (
                        <article className="prose prose-lg max-w-none font-work-sans break-words selectable" dangerouslySetInnerHTML={{ __html: parseContent }} />

                    ) : (
                        <p className="no-result">no details provided</p>
                    )}

                    {/* 交互功能栏 */}
                    <div className="flex items-center space-x-6 mt-8 pt-6 border-t">
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-2"
                            onClick={handleLike}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            <span>{likesCount} likes</span>
                        </Button>

                        <Button
                            variant="ghost"
                            className="flex items-center space-x-2"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span>{commentsCount} comments</span>
                        </Button>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8">
                        <CommentList
                            blogId={blog._id}
                            onCommentUpdate={handleCommentUpdate}
                        />
                    </div>
                </article>
            </div>
            <SigninDialog open={showSignIn} onOpenChange={setShowSignIn} />
        </>
    );
}