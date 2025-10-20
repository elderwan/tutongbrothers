"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter()

    useEffect(() => {
        // Short delay so the user sees a message briefly and to avoid
        // surprising immediate navigation during hydration.
        const t = setTimeout(() => {
            // use replace so back button won't return to the 404 page
            router.replace("/homepage")
        }, 400)

        return () => clearTimeout(t)
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div>
                <h1 className="text-2xl font-medium">page not found (404)</h1>
                <p className="mt-2 text-sm text-muted-foreground">turning to homepage...</p>
            </div>
        </div>
    )
}
