"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useErrorDialog } from "@/components/dialogs/error-dialog";

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

export default function ImageUpload({
    images,
    onImagesChange,
    maxImages = 6
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showError } = useErrorDialog();

    // Cloudinary upload preset - you'll need to set this up in your Cloudinary dashboard
    const CLOUDINARY_UPLOAD_PRESET = "blog_images"; // Replace with your upload preset
    const CLOUDINARY_CLOUD_NAME = "dewxaup4t"; // Replace with your cloud name

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) return;

        // Check if adding these files would exceed the limit
        if (images.length + files.length > maxImages) {
            showError({
                title: "Too Many Images",
                code: 400,
                msg: `You can only upload up to ${maxImages} images. Currently you have ${images.length} images.`
            });
            return;
        }

        setUploading(true);

        try {
            const uploadPromises = files.map(async (file) => {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    throw new Error(`${file.name} is not an image file`);
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`${file.name} is too large. Maximum size is 5MB.`);
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.name}`);
                }

                const data = await response.json();
                return data.secure_url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            onImagesChange([...images, ...uploadedUrls]);

            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload error:', error);
            showError({
                title: "Upload Failed",
                code: 500,
                msg: error instanceof Error ? error.message : "Failed to upload images"
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileSelect}
                    disabled={uploading || images.length >= maxImages}
                    className="flex items-center gap-2 bg-cream"
                >
                    {uploading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            Upload Images ({images.length}/{maxImages})
                        </>
                    )}
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                    src={imageUrl}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {images.length === 0 && (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={triggerFileSelect}
                >
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload images</p>
                    <p className="text-sm text-gray-400">
                        Support JPG, PNG, GIF up to 5MB each. Maximum {maxImages} images.
                    </p>
                </div>
            )}
        </div>
    );
}