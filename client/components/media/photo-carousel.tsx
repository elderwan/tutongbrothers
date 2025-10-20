"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const photos = [
    "/photo/tong1.jpg",
    "/photo/tong2.jpg",
    "/photo/tong3.jpg",
    "/photo/tong4.jpg",
    "/photo/tong5.jpg",
    "/photo/tong6.jpg",
    "/photo/tong7.jpg",
]

export default function PhotoCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [photosPerView, setPhotosPerView] = useState(3)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [minusIndex, setMinusIndex] = useState(3);
    const [minusIndicator, setMinusIndicator] = useState(2);
    const [totalIndicatorsCal, setTotalIndicatorsCal] = useState(0);

    // 检测屏幕尺寸并设置每次显示的照片数量

    useEffect(() => {
        const updatePhotosPerView = () => {
            if (window.innerWidth < 768) {
                setPhotosPerView(1) // 移动端显示1张
                setMinusIndex(1);
                setMinusIndicator(0);
            } else if (window.innerWidth < 1024) {
                setPhotosPerView(2) // 平板显示2张
                setMinusIndex(2);
                setMinusIndicator(1);
            } else {
                setPhotosPerView(3) // 桌面端显示3张
                setMinusIndex(3);
                setMinusIndicator(2);
            }
        }

        updatePhotosPerView()
        window.addEventListener('resize', updatePhotosPerView)

        return () => window.removeEventListener('resize', updatePhotosPerView)
    }, [])

    // 重置currentIndex当photosPerView改变时
    useEffect(() => {
        const maxIndex = photos.length;
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex)
        }
    }, [photosPerView, currentIndex])

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = photos.length - minusIndex;
            return prevIndex + 1 > maxIndex ? 0 : prevIndex + 1
        })
    }, [photosPerView])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = photos.length - minusIndex;
            return prevIndex - 1 < 0 ? maxIndex : prevIndex - 1
        })
    }, [photosPerView])


    // 触摸滑动处理
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0)
        setTouchStart(e.targetTouches[0].clientX)
        setIsAutoPlaying(false) // 停止自动播放
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) {
            nextSlide()
        } else if (isRightSwipe) {
            prevSlide()
        }

        // 重新启动自动播放
        setTimeout(() => setIsAutoPlaying(true), 3000)
    }

    // 自动轮播
    useEffect(() => {
        if (!isAutoPlaying) return

        const timer = setInterval(() => {
            nextSlide()
        }, 4000)

        return () => clearInterval(timer)
    }, [nextSlide, isAutoPlaying])

    // 暂停/恢复自动播放
    const handleMouseEnter = () => setIsAutoPlaying(false)
    const handleMouseLeave = () => setIsAutoPlaying(true)

    // 计算总的可滑动位置数

    useEffect(() => {
        setTotalIndicatorsCal(photos.length - minusIndicator);
    }, [photosPerView])

    // 跳转到指定位置
    const goToIndex = (targetIndex: number) => {
        setCurrentIndex(targetIndex)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 3000)
    }


    return (
        <div className="px-2 md:px-20 2xl:px-50 py-4">
            <div className="relative">
                {/* 轮播容器 */}
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* 左箭头 */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 shadow-md rounded-full"
                    // disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* 照片展示区域 */}
                    <div
                        className="overflow-hidden mx-12"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${(currentIndex / photosPerView) * 100}%)`,
                                width: "100%"
                            }}
                        >
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-[3/4] flex-shrink-0"
                                    style={{
                                        width: `${100 / photosPerView}%`,
                                        padding: photosPerView > 1 ? "0 8px" : "0"
                                    }}
                                >
                                    <div className="relative h-full w-full shadow-sm">
                                        <Image
                                            src={photo}
                                            alt={`照片 ${index}`}
                                            fill
                                            className="object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 右箭头 */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 shadow-md rounded-full"
                    // disabled={currentIndex == photos.length - 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* 指示器 */}
                <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalIndicatorsCal }).map((_, indicatorIndex) => (
                        <button
                            key={indicatorIndex}
                            onClick={() => goToIndex(indicatorIndex)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === indicatorIndex
                                ? "bg-blue-500 scale-125"
                                : "bg-gray-300 hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}