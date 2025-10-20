"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    return (
        <div className="border rounded-md">
            <Textarea
                placeholder="Write your blog content here... (Markdown supported)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-[300px] resize-none border-0 p-4"
            />
            <div className="border-t px-4 py-2 text-sm text-gray-500">
                Markdown supported: **bold**, *italic*, # heading, - list, [link](url), ![image](url)
            </div>
        </div>
    );
}