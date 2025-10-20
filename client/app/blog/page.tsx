"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import BlogSearch from "@/components/blog/blog-search";
import { getBlogs, Blog as ApiBlog } from "@/api/blog";

// 定义博客类型
interface Blog {
    _id: string;
    title: string;
    description: string; // Blog description/summary
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

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    // 处理搜索参数变化
    const handleSearchChange = async (searchParams: {
        search?: string;
        type?: string;
        sortBy?: string;
    }) => {
        try {
            setLoading(true);
            const response = await getBlogs(
                searchParams.search || undefined,
                searchParams.type === "all" ? undefined : searchParams.type,
                searchParams.sortBy || "newest"
            );

            if (response.code === 200) {
                // 转换API返回的博客数据格式
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
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载博客数据
    useEffect(() => {
        handleSearchChange({});
    }, []);

    return (
        <div className="px-2 md:px-20 2xl:px-60 py-8">
            {/* 搜索组件 */}
            <div className="mb-8">
                <BlogSearch onSearch={handleSearchChange} />
            </div>

            {/* 博客列表 */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {blogs.map((blog) => (
                    <div key={blog._id} className="mb-6 break-inside-avoid">
                        <BlogCard blog={blog} onDeleted={(deletedId) => setBlogs(prev => prev.filter(b => b._id !== deletedId))} />
                    </div>
                ))}
            </div>
        </div>
    );
}