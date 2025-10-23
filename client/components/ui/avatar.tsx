"use client"

import * as React from "react"
import Image from "next/image"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  alt,
  priority = false,
  sizes = "128px",
  quality = 90,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
  priority?: boolean;
  sizes?: string;
  quality?: number;
}) {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  // 如果提供了 src，使用 Next.js Image 优化
  if (src && typeof src === 'string') {
    return (
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        className={cn("aspect-square size-full relative overflow-hidden rounded-full", className)}
        src={src}
        alt={alt}
        asChild
      >
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt || "Avatar"}
            fill
            className="object-cover rounded-full"
            sizes={sizes}
            quality={quality}
            priority={priority}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </AvatarPrimitive.Image>
    )
  }

  // 降级到原生 Radix UI
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      src={src}
      alt={alt}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-secondary flex size-full items-center justify-center rounded-[inherit] text-xs",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
