import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-light-beige file:text-forest-green placeholder:text-medium-text/60 flex h-12 w-full min-w-0    border-2 bg-white px-5 py-3 text-base shadow-beagle-sm transition-all duration-300 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-warm-orange focus:ring-2 focus:ring-warm-orange/20 focus:shadow-beagle-md",
        "hover:border-orange hover:shadow-beagle-md",
        type === "search" &&
        "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
        type === "file" &&
        "text-medium-text/70 file:border-light-beige file:text-forest-green p-0 pr-4 italic file:me-4 file:h-full file:border-0 file:border-r-2 file:border-solid file:bg-transparent file:px-4 file:text-sm file:font-semibold file:not-italic",
        className
      )}
      {...props}
    />
  )
}

export { Input }
