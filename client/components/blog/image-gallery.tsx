"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ImageGalleryProps {
    images: string[];
    title?: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    useEffect(() => {
        if (selectedImageIndex !== null) {
            // 禁用滚动
            document.body.style.overflow = "hidden";
        } else {
            // 恢复滚动
            document.body.style.overflow = "";
        }

        // 组件卸载时恢复
        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedImageIndex]);


    if (!images || images.length === 0) {
        return null;
    }

    const openImage = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeImage = () => {
        setSelectedImageIndex(null);
    };

    const goToPrevious = () => {
        if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const goToNext = () => {
        if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeImage();
        } else if (e.key === 'ArrowLeft') {
            goToPrevious();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    };

    // Grid layout logic based on number of images
    const getGridClass = () => {
        switch (images.length) {
            case 1:
                return "grid-cols-1 place-items-center"; // 居中显示
            case 2:
                return "grid-cols-2";
            case 3:
                return "grid-cols-3";
            case 4:
                return "grid-cols-2";
            case 5:
                return "grid-cols-3";
            default:
                return "grid-cols-3";
        }
    };

    const getImageClass = (index: number) => {
        const totalImages = images.length;

        if (totalImages === 1) {
            // 单图时限制最大宽度
            return "w-full max-w-[400px] aspect-auto";
        }
        if (totalImages === 4) {
            return "aspect-square";
        } else if (totalImages === 5) {
            if (index < 2) return "aspect-square";
            if (index === 2) return "col-span-3 aspect-video";
            return "aspect-square";
        } else if (totalImages >= 6) {
            if (index === 0) return "col-span-2 row-span-2 aspect-square";
            return "aspect-square";
        }

        return "aspect-square";
    };

    return (
        <>
            {/* Image Grid */}
            <div className={`grid ${getGridClass()} gap-2 rounded-lg overflow-hidden w-full lg:max-w-[400px] xl:max-w-[800px] mx-auto`}>
                {images.slice(0, 6).map((image, index) => (
                    <div
                        key={index}
                        className={`${getImageClass(index)} overflow-hidden cursor-pointer group relative rounded-2xl`}
                        onClick={() => openImage(index)}
                    >
                        <img
                            src={image}
                            alt={`${title || 'Image'} ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                        {/* Show count for last image if there are more than 6 */}
                        {index === 5 && images.length > 6 && (
                            <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">
                                    +{images.length - 6}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImageIndex !== null && (
                <div
                    className="fixed inset-0 bg-white/30 backdrop-blur-md z-50 flex items-center justify-center"

                    onClick={closeImage}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
                        onClick={closeImage}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 disabled:opacity-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                disabled={selectedImageIndex === 0}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 disabled:opacity-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                disabled={selectedImageIndex === images.length - 1}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                        </>
                    )}

                    {/* Image */}
                    <div
                        className="
                        max-w-[90vw] max-h-[70vh]    
                        sm:max-w-[70vw] sm:max-h-[60vh] 
                        lg:max-w-[45vw] lg:max-h-[45vh]  
                        flex items-center justify-center
                      "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[selectedImageIndex]}
                            alt={`${title || 'Image'} ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                        {selectedImageIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    );
}