"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { uploadImageFromDataUrl } from "@/lib/uploadImage";

interface ImageCropperProps {
    onImageCropped: (imageUrl: string) => void;
    isOpen: boolean;
    onClose: () => void;
    aspectRatio?: number; // ✅ 新增比例参数（可选）
}

export function ImageCropper({
    onImageCropped,
    isOpen,
    onClose,
    aspectRatio = 1, // ✅ 默认正方形比例
}: ImageCropperProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 文件选择
    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    // 裁剪区域变更时回调
    const onCropComplete = useCallback((_: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // 使用 canvas 裁剪图像
    const createCroppedImage = useCallback(async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        try {
            setUploading(true);
            const image = await createImage(imageSrc);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const { width, height, x, y } = croppedAreaPixels;
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            const result = await uploadImageFromDataUrl(dataUrl, "avatar.jpg");

            onImageCropped(result.url);
            handleCancel();
        } catch (err) {
            console.error("Crop failed:", err);
        } finally {
            setUploading(false);
        }
    }, [imageSrc, croppedAreaPixels, onImageCropped]);

    const handleCancel = () => {
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleCancel}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {!imageSrc ? (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                            <Upload className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 mb-4">Choose an image to crop</p>
                            <Button onClick={() => fileInputRef.current?.click()}>Select Image</Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onFileChange}
                            />
                        </div>
                    ) : (
                        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                            {/* 裁剪区 */}
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio} // ✅ 使用传入的比例
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />

                            {/* 底部滑动条 */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-6 py-3 flex items-center justify-center backdrop-blur-sm">
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="
                                        w-full max-w-[70%] appearance-none cursor-pointer
                                        h-2 rounded-lg bg-gray-300/60
                                        accent-white
                                        [&::-webkit-slider-thumb]:appearance-none
                                        [&::-webkit-slider-thumb]:h-4
                                        [&::-webkit-slider-thumb]:w-4
                                        [&::-webkit-slider-thumb]:rounded-full
                                        [&::-webkit-slider-thumb]:bg-white
                                        [&::-webkit-slider-thumb]:shadow-lg
                                        [&::-webkit-slider-thumb]:transition-transform
                                        [&::-webkit-slider-thumb]:hover:scale-125
                                    "
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button onClick={createCroppedImage} disabled={!imageSrc || uploading}>
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                            </>
                        ) : (
                            "Crop & Upload"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// 读取图像的辅助函数
async function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", reject);
        img.src = url;
    });
}
