import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border-none px-5 py-2 text-sm font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-warm-orange to-orange text-white    shadow-orange [a&]:hover:shadow-orange-lg [a&]:hover:-translate-y-0.5",
        secondary:
          "bg-light-beige text-forest-green rounded-beagle-sm font-semibold [a&]:hover:bg-forest-green [a&]:hover:text-cream",
        destructive:
          "bg-gradient-to-br from-red-600 to-red-500 text-white    shadow-orange [a&]:hover:shadow-orange-lg",
        outline:
          "border-2 border-forest-green text-forest-green bg-transparent rounded-beagle-sm [a&]:hover:bg-forest-green [a&]:hover:text-cream",
        light:
          "bg-cream text-forest-green rounded-beagle-sm font-medium [a&]:hover:bg-light-beige",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
