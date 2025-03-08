"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { History, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLoading } from "@/providers/loading-provider"
import { useRouter } from "next/navigation"

type SearchItem = {
  id: string
  query: string
  imageUrl: string
  timestamp: number
}

export default function SearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>([])
  const { showLoading } = useLoading()
  const router = useRouter()

  useEffect(() => {
    // Load search history from localStorage
    const storedHistory = localStorage.getItem("searchHistory")
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory)
        setSearchHistory(parsedHistory)
      } catch (error) {
        console.error("Failed to parse search history:", error)
      }
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("searchHistory")
    setSearchHistory([])
  }

  const removeHistoryItem = (id: string) => {
    const updatedHistory = searchHistory.filter((item) => item.id !== id)
    setSearchHistory(updatedHistory)
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
  }

  // If there's no search history, don't render the component
  if (searchHistory.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Your Search History</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {searchHistory.map((item) => (
          <div key={item.id} className="relative group">
            <Link
              href={`/results?query=${encodeURIComponent(item.query)}`}
              onClick={(e) => {
                e.preventDefault()
                showLoading("search", `Searching for ${item.query}`)
                setTimeout(() => {
                  router.push(`/results?query=${encodeURIComponent(item.query)}`)
                }, 1500)
              }}
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-muted/30 border">
                <img
                  src={item.imageUrl || "/placeholder.svg?height=200&width=200"}
                  alt={item.query}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-medium truncate">{item.query}</h3>
                <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                removeHistoryItem(item.id)
              }}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove from history"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

