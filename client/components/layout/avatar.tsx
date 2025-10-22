"use client"
import React, { useState } from "react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X } from "lucide-react"

export default function HoverCardDemo() {
  const [open, setOpen] = useState(false)

  const AvatarContent = ({ showCloseButton = false }: { showCloseButton?: boolean }) => (
    <div className={showCloseButton ? "space-y-4 md:space-y-8" : "space-y-8"}>
      {showCloseButton && (
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-light-beige transition-colors"
          >
            <X className="h-4 w-4 text-forest-green" />
          </button>
        </div>
      )}
      <div className={`flex items-center justify-center ${showCloseButton ? "gap-4 md:gap-8" : "gap-8"}`}>
        <img
          className="shrink-0 rounded-full border-forest-green/20 border-3 border-solid shadow-beagle-md"
          src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761116329/detailAvatar_ehbdsf.png"
          width={showCloseButton ? 80 : 120}
          height={showCloseButton ? 80 : 120}
          alt="Avatar"
        />
        <div className={showCloseButton ? "space-y-2 md:space-y-3" : "space-y-3"}>
          <p className={`font-bold font-mono text-forest-green ${showCloseButton ? "text-lg md:text-2xl" : "text-2xl"}`}>Edward Won</p>
          <p className={`text-medium-text font-mono font-semibold ${showCloseButton ? "text-sm md:text-lg" : "text-lg"}`}>@elderwan97</p>
          <p className={`text-medium-text font-mono font-semibold ${showCloseButton ? "text-sm md:text-lg" : "text-lg"}`}>@beaglewang</p>
        </div>
      </div>
      <p className={`text-medium-text font-mono leading-relaxed text-start flex flex-col ${showCloseButton ? "pl-3 md:pl-5 text-base md:text-xl space-y-1 md:space-y-0" : "pl-5 text-xl"}`}>
        <strong className="text-forest-green font-bold">📷 Beagle s*xy photographer</strong>
        <strong className="text-forest-green font-bold">💻 Beagle programmer</strong>
        <strong className="text-forest-green font-bold">🪩 Beagle Dancer</strong>
      </p>
    </div>
  )

  return (
    <>
      {/* PC: HoverCard */}
      <div className="hidden md:block">
        <HoverCard openDelay={0} closeDelay={500}>
          <div className="flex items-center gap-8 font-mono sm:scale-100 scale-75">
            <HoverCardTrigger asChild>
              <img
                className="shrink-0 rounded-full border-gray-300 border-3 border-solid shadow-md cursor-pointer"
                src="https://res.cloudinary.com/dewxaup4t/image/upload/v1761116330/avatar_q3e9wa.png"
                width={160}
                height={160}
                alt="Avatar"
              />
            </HoverCardTrigger>
            <div className="space-y-3">
              <HoverCardTrigger asChild>
                <p className="text-3xl font-medium hover:underline font-mono cursor-pointer">
                  Edward Won
                </p>
              </HoverCardTrigger>
              <p className="text-muted-foreground text-xl font-mono"><a className="hover:underline" target="_blank" href="https://www.instagram.com/elderwan97/">@elderwan97</a></p>
              <p className="text-muted-foreground text-xl font-mono"><a className="hover:underline" target="_blank" href="https://weibo.com/u/2193725294">@beaglewang</a></p>
            </div>
          </div>
          <HoverCardContent className="glass rounded-beagle-lg shadow-beagle-lg border border-white/20 w-[400px] p-6 font-mono">
            <AvatarContent />
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Mobile: Popover with close button */}
      <div className="block md:hidden">
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-8 font-mono sm:scale-100 scale-75">
            <PopoverTrigger asChild>
              <img
                className="shrink-0 rounded-full border-gray-300 border-3 border-solid shadow-md cursor-pointer"
                src="/avatar/avatar.png"
                width={160}
                height={160}
                alt="Avatar"
              />
            </PopoverTrigger>
            <div className="space-y-3">
              <PopoverTrigger asChild>
                <p className="text-3xl font-medium hover:underline font-mono cursor-pointer">
                  Edward Won
                </p>
              </PopoverTrigger>
              <p className="text-muted-foreground text-xl font-mono"><a className="hover:underline" target="_blank" href="https://www.instagram.com/elderwan97/">@elderwan97</a></p>
              <p className="text-muted-foreground text-xl font-mono"><a className="hover:underline" target="_blank" href="https://weibo.com/u/2193725294">@beaglewang</a></p>
            </div>
          </div>
          <PopoverContent className="glass rounded-beagle-lg shadow-beagle-lg border border-white/20 w-[300px] md:w-[400px] p-4 font-mono">
            <AvatarContent showCloseButton={true} />
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
