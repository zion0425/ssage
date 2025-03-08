import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchSpinnerProps {
  isVisible: boolean
  className?: string
}

export function SearchSpinner({ isVisible, className }: SearchSpinnerProps) {
  if (!isVisible) return null

  return (
    <div
      className={cn(
        "absolute right-16 top-1/2 transform -translate-y-1/2 transition-opacity",
        isVisible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <Loader2 className="h-5 w-5 text-primary animate-spin" />
    </div>
  )
}
