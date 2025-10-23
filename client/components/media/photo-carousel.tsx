"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { getPhotos, Photo } from "@/api/photo"

export default function PhotoCarousel() {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [showFullScreen, setShowFullScreen] = useState(false)
    const [loading, setLoading] = useState(true)

    // 加载照片数据
    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const response = await getPhotos()
                // console.log('📸 API Response:', response)
                if (response.code === 200) {
                    // console.log('📸 Photos loaded:', response.data.length, 'photos')
                    setPhotos(response.data)
                }
            } catch (error) {
                console.error("Failed to load photos:", error)
            } finally {
                setLoading(false)
            }
        }
        loadPhotos()
    }, [])

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        )
    }, [photos.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        )
    }, [photos.length])

    // Auto-play with 4 second intervals
    useEffect(() => {
        if (!isAutoPlaying || photos.length === 0) return

        const timer = setInterval(() => {
            nextSlide()
        }, 4000)

        return () => clearInterval(timer)
    }, [nextSlide, isAutoPlaying, photos.length])

    // Pause/resume auto-play
    const handleMouseEnter = () => setIsAutoPlaying(false)
    const handleMouseLeave = () => setIsAutoPlaying(true)

    // Jump to specific index
    const goToIndex = (targetIndex: number) => {
        setCurrentIndex(targetIndex)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 3000)
    }

    // Open fullscreen
    const openFullScreen = () => {
        setShowFullScreen(true)
        setIsAutoPlaying(false)
    }

    // Close fullscreen
    const closeFullScreen = () => {
        setShowFullScreen(false)
        setIsAutoPlaying(true)
    }

    if (loading) {
        return (
            <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center bg-light-beige/30">
                <p className="text-medium-text">loading...</p>
            </div>
        )
    }

    if (photos.length === 0) {
        return (
            <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center bg-light-beige/30">
                <p className="text-medium-text">no photos yet</p>
            </div>
        )
    }

    const currentPhoto = photos[currentIndex]

    return (
        <>
            <div
                className="relative w-full max-w-full h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden bg-light-beige/30"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Image Track */}
                <div
                    className="flex h-full w-full transition-transform duration-700 ease-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {photos.map((photo, index) => {
                        // 懒加载优化：只加载当前、前一张、后一张
                        const isActive = index === currentIndex
                        const isPrev = index === (currentIndex - 1 + photos.length) % photos.length
                        const isNext = index === (currentIndex + 1) % photos.length
                        const shouldLoad = isActive || isPrev || isNext

                        return (
                            <div
                                key={photo._id}
                                className="relative h-full flex-shrink-0 w-full flex items-center justify-center cursor-pointer bg-light-beige/30"
                                onClick={openFullScreen}
                            >
                                {shouldLoad ? (
                                    <>
                                        {/* 背景模糊层 - 所有照片都使用 */}
                                        <div className="absolute inset-0">
                                            <Image
                                                src={photo.url}
                                                alt={`TutongBrothers ${index + 1} background`}
                                                fill
                                                className="object-cover blur-2xl scale-110 opacity-40"
                                                sizes="(max-width: 768px) 100vw, 800px"
                                                quality={30}
                                                loading={index === 0 ? "eager" : "lazy"}
                                            />
                                        </div>
                                        {/* 前景完整照片 - 所有照片都使用 object-contain */}
                                        <div className="relative h-full w-full flex items-center justify-center">
                                            <Image
                                                src={photo.url}
                                                alt={`TutongBrothers ${index + 1}`}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 1200px"
                                                quality={85}
                                                priority={index === 0}
                                                loading={index === 0 ? "eager" : "lazy"}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    // 未加载的照片显示占位符
                                    <div className="w-full h-full bg-light-beige/30 flex items-center justify-center">
                                        <p className="text-medium-text text-sm">loading...</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Navigation Buttons - Minimal Style */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        prevSlide()
                    }}
                    className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 transition-all duration-300 hover:scale-125"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]" strokeWidth={3} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        nextSlide()
                    }}
                    className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 transition-all duration-300 hover:scale-125"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]" strokeWidth={3} />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-10 px-4">
                    {photos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            className={`transition-all duration-300 rounded-full ${currentIndex === index
                                ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-warm-orange"
                                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80"
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Fullscreen Modal */}
            {showFullScreen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-xl z-50 flex items-center justify-center"
                    onClick={closeFullScreen}
                >
                    <button
                        onClick={closeFullScreen}
                        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                        aria-label="Close fullscreen"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div
                        className="relative w-[90vw] h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={currentPhoto.url}
                            alt="Fullscreen view"
                            fill
                            className="object-contain"
                            sizes="90vw"
                        />
                    </div>

                    {/* Navigation in fullscreen */}
                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    prevSlide()
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 transition-all duration-300 hover:scale-125"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-10 h-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" strokeWidth={3} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    nextSlide()
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 transition-all duration-300 hover:scale-125"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-10 h-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" strokeWidth={3} />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    )
}