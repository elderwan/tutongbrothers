import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-warm-orange focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-forest-green text-cream rounded-beagle-lg px-6 py-3 shadow-beagle-md hover:bg-warm-orange hover:-translate-y-0.5 hover:shadow-orange",
        accent:
          "bg-gradient-to-br from-warm-orange to-orange text-white rounded-beagle-lg px-10 py-4 text-lg font-bold shadow-orange hover:shadow-orange-lg hover:-translate-y-1",
        destructive:
          "bg-gradient-to-br from-red-600 to-red-500 text-white rounded-beagle-lg px-6 py-3 shadow-beagle-md hover:shadow-orange",
        outline:
          "border-2 border-forest-green bg-transparent text-forest-green rounded-beagle-lg px-6 py-3 hover:bg-forest-green hover:text-cream",
        secondary:
          "bg-light-beige text-forest-green rounded-beagle-lg px-6 py-3 shadow-beagle-sm hover:bg-forest-green hover:text-cream hover:-translate-y-0.5",
        ghost: "hover:bg-light-beige hover:text-forest-green    px-4 py-2",
        link: "text-warm-orange underline-offset-4 hover:underline hover:text-orange",
      },
      size: {
        default: "h-auto",
        sm: "text-sm px-4 py-2   ",
        lg: "text-xl px-12 py-5 rounded-beagle-xl",
        icon: "size-10   ",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
