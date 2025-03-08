"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronDown, Filter, Search, SlidersHorizontal, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SearchSpinner } from "@/components/search-spinner"
import { useLoading } from "@/providers/loading-provider"

export default function ResultsPage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const source = searchParams.get("source") || ""
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)
  const [isLoaded, setIsLoaded] = useState(false)
  const { hideLoading, showLoading } = useLoading()

  useEffect(() => {
    // Hide loading screen when component mounts
    if (!isLoaded) {
      // Simulate a delay to show results
      setTimeout(() => {
        hideLoading()
        setIsLoaded(true)
      }, 1000)
    }

    // Save search to history when the page loads
    if (query) {
      saveToSearchHistory(query)
    }
  }, [query, hideLoading, isLoaded])

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchBlur = () => {
    // Only blur if there's no search query
    if (!searchQuery) {
      setIsSearchFocused(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery && searchQuery !== query) {
      showLoading("search", "Searching for products")

      // Simulate a delay before refreshing results
      setTimeout(() => {
        window.location.href = `/results?query=${encodeURIComponent(searchQuery)}`
      }, 1500)
    }
  }

  const saveToSearchHistory = (searchQuery: string) => {
    try {
      // Get existing history
      const existingHistory = localStorage.getItem("searchHistory")
      let history = existingHistory ? JSON.parse(existingHistory) : []

      // Create new history item
      const newItem = {
        id: Date.now().toString(),
        query: searchQuery,
        imageUrl: "/placeholder.svg?height=200&width=200", // In a real app, this would be the actual image URL
        timestamp: Date.now(),
      }

      // Add to history (most recent first)
      history = [newItem, ...history.filter((item: any) => item.query.toLowerCase() !== searchQuery.toLowerCase())]

      // Limit history to 10 items
      if (history.length > 10) {
        history = history.slice(0, 10)
      }

      // Save back to localStorage
      localStorage.setItem("searchHistory", JSON.stringify(history))
    } catch (error) {
      console.error("Failed to save search history:", error)
    }
  }

  // Sample results data
  const results = [
    {
      id: 1,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 12.99,
      originalPrice: 21.0,
      currency: "USD",
      store: "AliExpress",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.8,
      reviews: 1243,
      shipping: "Free shipping",
      url: "#",
    },
    {
      id: 2,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 14.5,
      originalPrice: 22.0,
      currency: "USD",
      store: "Temu",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.6,
      reviews: 876,
      shipping: "$2.99 shipping",
      url: "#",
    },
    {
      id: 3,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 16.99,
      originalPrice: 24.0,
      currency: "USD",
      store: "Shopee",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.7,
      reviews: 1021,
      shipping: "Free shipping",
      url: "#",
    },
    {
      id: 4,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 18.5,
      originalPrice: 25.0,
      currency: "USD",
      store: "Taobao",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.5,
      reviews: 543,
      shipping: "$3.99 shipping",
      url: "#",
    },
    {
      id: 5,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 19.99,
      originalPrice: 24.99,
      currency: "USD",
      store: "iHerb",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.9,
      reviews: 2134,
      shipping: "Free shipping",
      url: "#",
    },
    {
      id: 6,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 21.99,
      originalPrice: 29.99,
      currency: "USD",
      store: "YesStyle",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.7,
      reviews: 1876,
      shipping: "$1.99 shipping",
      url: "#",
    },
    {
      id: 7,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 23.5,
      originalPrice: 30.0,
      currency: "USD",
      store: "Jolse",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.8,
      reviews: 987,
      shipping: "Free shipping",
      url: "#",
    },
    {
      id: 8,
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      image: "/placeholder.svg?height=300&width=300",
      price: 24.99,
      originalPrice: 29.99,
      currency: "USD",
      store: "StyleKorean",
      storeIcon: "/placeholder.svg?height=20&width=20",
      rating: 4.6,
      reviews: 765,
      shipping: "$2.99 shipping",
      url: "#",
    },
  ]

  // Sort results by price
  const sortedResults = [...results].sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price))

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 bg-background z-10 border-b">
        <div className="container mx-auto p-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-xl font-semibold flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault()
              showLoading("navigation", "Returning to home page")
              setTimeout(() => {
                window.location.href = "/"
              }, 800)
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">SSAGESSAGE</span>
          </Link>

          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex-1 flex items-center border rounded-full overflow-hidden shadow-sm">
                <div className="flex-1 flex items-center pl-3 relative">
                  <Search className="h-4 w-4 text-muted-foreground mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className="w-full py-2 outline-none text-sm"
                  />
                  <SearchSpinner isVisible={isSearchFocused} className="right-8" />
                </div>
                <label
                  htmlFor="results-image-upload"
                  className="cursor-pointer p-2 hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Upload image</span>
                  <input
                    id="results-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        showLoading("upload", "Analyzing your image")
                        setTimeout(() => {
                          window.location.href = "/results?source=image"
                        }, 2500)
                      }
                    }}
                  />
                </label>
              </div>
            </form>
          </div>

          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        <div className="container mx-auto px-4 pb-3 flex items-center justify-between gap-4 overflow-x-auto">
          <Tabs defaultValue="all" className="w-full max-w-md">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="exact">Exact Match</TabsTrigger>
              <TabsTrigger value="similar">Similar</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="whitespace-nowrap">
              Free Shipping
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 whitespace-nowrap">
                  <SlidersHorizontal className="h-4 w-4" />
                  Price: {sortOrder === "asc" ? "Low to High" : "High to Low"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedResults.map((product) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-muted/30 relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <img
                    src={product.storeIcon || "/placeholder.svg"}
                    alt={product.store}
                    className="w-3 h-3 rounded-full"
                  />
                  <span className="text-xs font-medium">{product.store}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{product.shipping}</p>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 싸게싸게 (SsageSSage). All rights reserved.
        </div>
      </footer>
    </div>
  )
}

