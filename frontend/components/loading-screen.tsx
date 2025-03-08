"use client"

import { useEffect, useState } from "react"
import { Loader2, Search, Image } from "lucide-react"

interface LoadingScreenProps {
  isVisible: boolean
  message?: string
  type?: "navigation" | "search" | "upload"
}

export function LoadingScreen({ isVisible, message = "Loading...", type = "navigation" }: LoadingScreenProps) {
  const [loadingDots, setLoadingDots] = useState("")

  useEffect(() => {
    if (!isVisible) return
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)
    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-background border rounded-lg shadow-lg p-8 max-w-md w-full mx-4 flex flex-col items-center">
        <div className="mb-6 relative">
          {type === "navigation" && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
          {type === "search" && (
            <div className="relative">
              <Search className="h-12 w-12 text-primary" />
              <div className="absolute -right-1 -bottom-1">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            </div>
          )}
          {type === "upload" && (
            <div className="relative">
              <Image className="h-12 w-12 text-primary" />
              <div className="absolute -right-1 -bottom-1">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            </div>
          )}
        </div>

        <h3 className="text-xl font-medium mb-2">
          {message}
          <span className="inline-block w-8">{loadingDots}</span>
        </h3>

        <p className="text-muted-foreground text-center">
          {type === "navigation" && "Please wait while we load the page."}
          {type === "search" && "We're searching for the best prices across multiple stores."}
          {type === "upload" && "Analyzing your image to find matching products."}
        </p>

        <div className="mt-6 w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full animate-pulse"
            style={{
              width: "100%",
              animation: "pulse 1.5s infinite, progress 3s infinite linear",
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          20% { width: 20%; }
          50% { width: 50%; }
          70% { width: 70%; }
          90% { width: 90%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
