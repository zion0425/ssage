"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Upload, TrendingUp, Search } from "lucide-react"
import { Button } from "../components/ui/button"
import SearchHistory from "../components/search-history"
import { SearchSpinner } from "../components/search-spinner"
import { useLoading } from "../providers/loading-provider"
import { useRouter } from "next/navigation"

export default function Home() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { showLoading, hideLoading } = useLoading()
  const router = useRouter()

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchFocused(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      showLoading("search", "Searching for products")
      setTimeout(() => {
        router.push(`/results?query=${encodeURIComponent(searchQuery)}`)
      }, 1500)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      showLoading("upload", "Analyzing your image")
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append("image", file)
        // 백엔드 URL 고정값
        const backendUrl = "http://localhost:8081"
        const response = await fetch(`${backendUrl}/search`, {
          method: "POST",
          body: formData,
        })
        if (!response.ok) {
          throw new Error("Error searching image")
        }
        const data = await response.json()
        localStorage.setItem("searchResults", JSON.stringify(data))
        router.push("/results?source=image")
      } catch (error) {
        console.error("Error searching image:", error)
      } finally {
        hideLoading()
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          SSAGESSAGE
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 py-12 gap-12">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-white bg-clip-text text-transparent">
            싸게싸게
          </h1>
          <p className="text-muted-foreground">
            "최저가 상품 이미지 검색 - 알리바바, 타오바오, 구글"
          </p>
        </div>

        <div className="w-full max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center border-2 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow focus-within:border-primary">
              <div className="flex-1 flex items-center pl-4 relative">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search products or upload an image"
                  className="w-full py-3 outline-none text-sm"
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
                <SearchSpinner isVisible={isSearchFocused} />
              </div>
              <label htmlFor="image-upload" className="cursor-pointer p-3 hover:bg-muted/50 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Upload image</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
              <Button type="submit" className="rounded-l-none rounded-r-full">
                Search
              </Button>
            </div>
          </form>
        </div>

        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Trending Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingProducts.map((product) => (
              <Link
                key={product.id}
                href={`/results?query=${encodeURIComponent(product.name)}`}
                className="group"
                onClick={(e) => {
                  e.preventDefault()
                  showLoading("search", `Searching for ${product.name}`)
                  setTimeout(() => {
                    router.push(`/results?query=${encodeURIComponent(product.name)}`)
                  }, 1500)
                }}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-muted/30">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {product.searches} recent searches
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SearchHistory />
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 싸게싸게 (SsageSSage). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const trendingProducts = [
  { id: 1, name: "Innisfree Green Tea Serum", image: "/placeholder.svg?height=200&width=200", searches: 1243 },
  { id: 2, name: "COSRX Snail Mucin Essence", image: "/placeholder.svg?height=200&width=200", searches: 982 },
  { id: 3, name: "Etude House Eyeshadow Palette", image: "/placeholder.svg?height=200&width=200", searches: 876 },
  { id: 4, name: "Laneige Lip Sleeping Mask", image: "/placeholder.svg?height=200&width=200", searches: 754 },
  { id: 5, name: "Sulwhasoo First Care Serum", image: "/placeholder.svg?height=200&width=200", searches: 621 },
]
