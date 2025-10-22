import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-light-beige placeholder:text-medium-text/60 flex field-sizing-content min-h-32 w-full    border-2 bg-white px-5 py-4 text-base shadow-beagle-sm transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 focus:shadow-beagle-md",
        "hover:border-orange hover:shadow-beagle-md",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
