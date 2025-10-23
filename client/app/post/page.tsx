"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { createBlog } from "@/api/blog";
import { useAuth } from "@/contexts/AuthContext";
import ImageUpload from "@/components/blog/image-upload";
import React from "react";
import MDEditor from '@uiw/react-md-editor';


// 动态导入 Markdown 编辑器组件，避免 SSR 问题
const MarkdownEditor = dynamic(
    () => import('@/components/blog/markdown-editor'),
    { ssr: false }
);

// 定义博客类型选项
const blogTypes = [
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "tech", label: "Technology" },
    { value: "other", label: "Other" },
];

export default function PostBlogPage() {
    const { showError } = useErrorDialog();
    const { user } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 处理提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !type || !content) {
            alert("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        try {
            // 这里应该从认证信息中获取实际的用户ID

            const response = await createBlog({
                title,
                description,
                content,
                type,
                userId: user?.id || "",
                userName: user?.userName || "Author Name",
                userImg: user?.userImg || "",
                images: images
            });

            if (response.code === 201) {
                // 如果成功，跳转到博客列表页面
                router.push('/blog');
            } else {
                showError({
                    title: "post fail",
                    code: response.code,
                    msg: response.msg
                });
            }
        } catch (error) {
            console.error("Failed to post blog:", error);
            showError({
                title: "post fail",
                code: 500,
                msg: "Internal server error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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

            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 标题输入 */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                            Title
                        </label>
                        <Input
                            id="title"
                            placeholder="Enter blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* 描述输入 */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Enter a brief description of your blog"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            required
                        />
                    </div>

                    {/* 类型选择 */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-2">
                            Type
                        </label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-[#FFFFFF]">
                                <SelectValue placeholder="Select blog type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#FFFFFF]">
                                {blogTypes.map((blogType) => (
                                    <SelectItem key={blogType.value} value={blogType.value}>
                                        {blogType.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 内容编辑器 */}
                    <div data-color-mode="light">
                        <label htmlFor="content" className="block text-sm font-medium mb-2">
                            Content
                        </label>
                        {/* <MarkdownEditor
                            value={content}
                            onChange={setContent}
                        /> */}
                        <MDEditor
                            value={content}
                            onChange={(v) => setContent(v || "")}
                            minHeight={100}
                            height={400}
                        />
                        <MDEditor.Markdown source={content} style={{ whiteSpace: 'pre-wrap' }} />
                    </div>

                    {/* 图片上传 */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Images (Optional)
                        </label>
                        <ImageUpload
                            images={images}
                            onImagesChange={setImages}
                            maxImages={6}
                        />
                    </div>

                    {/* 提交按钮 */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Posting..." : "Post Blog"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}