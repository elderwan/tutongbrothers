"use client"

import React, { useState, useEffect } from "react"
import { useId } from "react"
import { Brush, Eraser, Scissors, SwatchBook, X, Code, Database, Globe, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import Image from 'next/image'
import { getTechStack, TechCategory } from "@/api/techStack"

const TechStack = () => {
    const id = useId()
    const [open, setOpen] = useState(false)
    const [techCategories, setTechCategories] = useState<TechCategory[]>([])

    // 获取技术栈数据
    useEffect(() => {
        const fetchTechStack = async () => {
            try {
                const response = await getTechStack();
                if (response.code === 200) {
                    setTechCategories(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch tech stack:", error);
            }
        };

        fetchTechStack();
    }, [])

    const handleItemClick = (link: string) => {
        window.open(link, '_blank')
    }

    return (
        <div className="flex justify-center">
            {/* PC: HoverCard */}
            <div className="hidden md:block">
                <HoverCard openDelay={0} closeDelay={500}>
                    <HoverCardTrigger asChild>
                        <Button variant="secondary" size="lg">Tech Stack</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="glass rounded-beagle-lg shadow-beagle-lg border border-white/20 w-[400px] p-6">
                        {techCategories.map((category, categoryIndex) => (
                            <div key={`${id}-category-${categoryIndex}`} className="mb-6 last:mb-0">
                                <h3 className="text-sm font-bold text-forest-green uppercase tracking-wider mb-3">{category.category}</h3>
                                <div className="border-t border-forest-green/10 mb-4"></div>
                                <div className="flex flex-wrap gap-2">
                                    {category.items.map((item, itemIndex) => (
                                        <button
                                            key={`${id}-${categoryIndex}-${itemIndex}`}
                                            onClick={() => handleItemClick(item.link)}
                                            className="flex items-center gap-2 px-3 py-2 bg-light-beige border-2 border-transparent rounded-beagle-sm hover:bg-warm-orange hover:text-white hover:border-warm-orange transition-all duration-300 cursor-pointer hover:-translate-y-1"
                                        >
                                            <Image
                                                src={item.imgLink}
                                                width={16}
                                                height={16}
                                                alt={item.label}
                                            />
                                            <span className="text-sm font-semibold">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* Mobile: Popover with close button */}
            <div className="block md:hidden">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="secondary" size="lg">Tech Stack</Button>
                    </PopoverTrigger>
                    <PopoverContent className="glass rounded-beagle-lg shadow-beagle-lg border border-white/20 w-[320px] p-4">
                        {/* Close button */}
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-full hover:bg-light-beige transition-colors"
                            >
                                <X className="h-4 w-4 text-forest-green" />
                            </button>
                        </div>
                        {techCategories.map((category, categoryIndex) => (
                            <div key={`${id}-mobile-category-${categoryIndex}`} className="mb-4 last:mb-0">
                                <h3 className="text-sm font-bold text-forest-green uppercase tracking-wider mb-2">{category.category}</h3>
                                <div className="border-t border-forest-green/10 mb-3"></div>
                                <div className="flex flex-wrap gap-2">
                                    {category.items.map((item, itemIndex) => (
                                        <button
                                            key={`${id}-mobile-${categoryIndex}-${itemIndex}`}
                                            onClick={() => {
                                                handleItemClick(item.link)
                                                setOpen(false)
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 bg-light-beige border-2 border-transparent rounded-beagle-sm hover:bg-warm-orange hover:text-white transition-all duration-300 cursor-pointer"
                                        >
                                           
                                            <Image
                                                src={item.imgLink}
                                                width={14}
                                                height={14}
                                                alt={item.label}
                                            />
                                            <span className="text-sm">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default TechStack