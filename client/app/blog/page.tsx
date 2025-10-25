"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import PostCard from "@/components/post/post-card";
import PostDetailDialog from "@/components/post/post-detail-dialog";
import BlogSearch from "@/components/blog/blog-search";
import { getBlogs, Blog as ApiBlog } from "@/api/blog";
import { getPostsApi, Post as ApiPost } from "@/api/post";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 定义博客类型
interface Blog {
    _id: string;
    title: string;
    description: string;
    content: string;
    userName: string;
    userImg: string;
    type: string;
    images: string[];
    likes: string[];
    comments: any[];
    createdAt: string;
    updatedAt: string;
}

interface Post {
    _id: string;
    content: string;
    userName: string;
    userImg: string;
    userId: string;
    images: string[];
    likes: string[];
    comments: any[];
    views: number;
    createdAt: string;
    updatedAt: string;
}

type ContentType = 'all' | 'blogs' | 'posts';

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [contentType, setContentType] = useState<ContentType>('all');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [showPostDetail, setShowPostDetail] = useState(false);

    // 处理搜索参数变化
    const handleSearchChange = async (searchParams: {
        search?: string;
        type?: string;
        sortBy?: string;
    }) => {
        try {
            setLoading(true);

            // Fetch blogs
            if (contentType === 'all' || contentType === 'blogs') {
                const response = await getBlogs(
                    searchParams.search || undefined,
                    searchParams.type === "all" ? undefined : searchParams.type,
                    searchParams.sortBy || "newest"
                );

                if (response.code === 200) {
                    const transformedBlogs: Blog[] = response.data.blogs.map((blog: ApiBlog) => ({
                        ...blog,
                        userId: blog.userId,
                        author: {
                            username: blog.userName,
                            user_img: blog.userImg
                        }
                    }));
                    setBlogs(transformedBlogs);
                }
            }

            // Fetch posts
            if (contentType === 'all' || contentType === 'posts') {
                const postsResponse = await getPostsApi(1, 20);
                if (postsResponse.code === 200) {
                    setPosts(postsResponse.data.posts);
                }
            }
        } catch (error) {
            console.error("Failed to fetch content:", error);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载数据
    useEffect(() => {
        handleSearchChange({});
    }, [contentType]);

    // Combine and sort blogs and posts by date
    const combinedContent = [
        ...blogs.map(b => ({ ...b, itemType: 'blog' as const })),
        ...posts.map(p => ({ ...p, itemType: 'post' as const }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredContent = combinedContent.filter(item => {
        if (contentType === 'blogs') return item.itemType === 'blog';
        if (contentType === 'posts') return item.itemType === 'post';
        return true;
    });

    return (
        <div className="px-2 md:px-20 2xl:px-60 py-8">
            {/* Filter Tabs */}
            <div className="mb-6">
                <Tabs value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="blogs">Blogs</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* 搜索组件 */}
            <div className="mb-8">
                <BlogSearch onSearch={handleSearchChange} />
            </div>

            {/* 内容列表 */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {filteredContent.map((item) => (
                    <div key={item._id} className="mb-6 break-inside-avoid">
                        {item.itemType === 'blog' ? (
                            <BlogCard
                                blog={item as Blog}
                                onDeleted={(deletedId) => setBlogs(prev => prev.filter(b => b._id !== deletedId))}
                            />
                        ) : (
                            <PostCard
                                post={item as Post}
                                onClick={(postId) => {
                                    setSelectedPostId(postId)
                                    setShowPostDetail(true)
                                }}
                                onDeleted={(deletedId) => setPosts(prev => prev.filter(p => p._id !== deletedId))}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Post Detail Dialog */}
            {selectedPostId && (
                <PostDetailDialog
                    open={showPostDetail}
                    onOpenChange={setShowPostDetail}
                    postId={selectedPostId}
                />
            )}
        </div>
    );
}