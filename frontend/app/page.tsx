// app/page.tsx
"use client"

import React, { useState, useEffect } from "react"

const trendingProductsData = [
  {
    id: 1,
    name: "Innisfree Green Tea Serum",
    image: "https://via.placeholder.com/200",
    searches: 1243,
  },
  {
    id: 2,
    name: "COSRX Snail Mucin Essence",
    image: "https://via.placeholder.com/200",
    searches: 982,
  },
  {
    id: 3,
    name: "Etude House Eyeshadow Palette",
    image: "https://via.placeholder.com/200",
    searches: 876,
  },
  {
    id: 4,
    name: "Laneige Lip Sleeping Mask",
    image: "https://via.placeholder.com/200",
    searches: 754,
  },
  {
    id: 5,
    name: "Sulwhasoo First Care Serum",
    image: "https://via.placeholder.com/200",
    searches: 621,
  },
]

export default function SearchPage() {
  // React state 관리
  const [file, setFile] = useState<File | null>(null)
  const [searchText, setSearchText] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState("") // "search", "upload", "navigation"
  const [loadingMessage, setLoadingMessage] = useState("")
  const [loadingDescription, setLoadingDescription] = useState("")
  const [dots, setDots] = useState("")

  // 로딩 중 점 애니메이션
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (loading) {
      setDots("")
      interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
      }, 500)
    } else {
      setDots("")
    }
    return () => clearInterval(interval)
  }, [loading])

  // Loading UI 제어 함수
  const showLoading = (type = "search", message = "Searching for products") => {
    setLoading(true)
    setLoadingType(type)
    setLoadingMessage(message)
    if (type === "search") {
      setLoadingDescription("We're searching for the best prices across multiple stores.")
    } else if (type === "upload") {
      setLoadingDescription("Analyzing your image to find matching products.")
    } else if (type === "navigation") {
      setLoadingDescription("Please wait while we load the page.")
    }
  }

  const hideLoading = () => {
    setLoading(false)
  }

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // 검색 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert("이미지를 선택해주세요.")
      return
    }

    showLoading("upload", "Analyzing your image")
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("이미지 검색 중 오류가 발생했습니다.")
      }

      const text = await response.text()
      hideLoading()
      if (!text) {
        setResults([])
        return
      }
      const data = JSON.parse(text)
      setResults(data)
    } catch (error: any) {
      hideLoading()
      alert(error.message)
      console.error("검색 오류:", error)
    }
  }

  // 트렌딩 제품 클릭 핸들러 (모의 검색)
  const handleTrendingClick = (product: typeof trendingProductsData[0]) => {
    showLoading("search", `Searching for ${product.name}`)
    setTimeout(() => {
      hideLoading()
      setResults([
        {
          productName: product.name,
          price: "₩15,000",
          link: "#",
        },
        {
          productName: `${product.name} (Alternative)`,
          price: "₩12,500",
          link: "#",
        },
      ])
    }, 1500)
  }

  return (
    <div className="container">
      {/* 헤더 */}
      <header>
        <h1 className="logo">SSAGE</h1>
        <nav>
          <a href="#">How it works</a>
          <a href="#">About</a>
        </nav>
      </header>

      <main>
        {/* Hero 섹션 */}
        <div className="hero">
          <h1 className="title">싸게싸게</h1>
          <p className="subtitle">"최저가 상품 이미지 검색 - 알리바바, 타오바오, 구글"</p>
        </div>

        {/* 검색 폼 */}
        <form onSubmit={handleSubmit} className="search-box">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                type="text"
                id="searchText"
                placeholder="Search products or upload an image"
                className="search-input"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  if (!searchText) setIsSearchFocused(false)
                }}
              />
              {isSearchFocused && (
                <div className="search-spinner" id="searchSpinner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="spinner-icon"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                </div>
              )}
            </div>
            <label htmlFor="imageInput" className="upload-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </svg>
              <span className="sr-only">Upload image</span>
            </label>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
              required
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>

        {/* 트렌딩 섹션 */}
        <div className="trending-section">
          <div className="section-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <h2>Trending Products</h2>
          </div>
          <div className="trending-grid" id="trendingProducts">
            {trendingProductsData.map((product) => (
              <a
                key={product.id}
                href="#"
                className="trending-item"
                onClick={(e) => {
                  e.preventDefault()
                  handleTrendingClick(product)
                }}
              >
                <div className="trending-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="trending-details">
                  <h3 className="trending-name">{product.name}</h3>
                  <p className="trending-searches">{product.searches} recent searches</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 검색 결과 섹션 */}
        <div className="results-container">
          <h2 className="results-title">Search Results</h2>
          <ul className="results" id="resultsList">
            {results.length === 0 ? (
              <li>검색 결과가 없습니다.</li>
            ) : (
              results.map((result, idx) => (
                <li key={idx}>
                  <strong>{result.productName}</strong>
                  <br />
                  가격: {result.price}
                  <br />
                  <a href={result.link} target="_blank" rel="noreferrer">
                    구매 페이지로 이동
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>

      {/* 푸터 */}
      <footer>
        <p>© 2024 싸게싸게 (SSAGE). All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>

      {/* 로딩 화면 */}
      {loading && (
        <div id="loadingScreen" className="loading-screen visible">
          <div className="loading-container">
            <div className="loading-icon-container">
              <div id="loadingIcon" className="loading-icon">
                {loadingType === "search" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                )}
                {loadingType === "upload" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                )}
                {loadingType === "navigation" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                )}
              </div>
              <div className="loading-spinner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="spinner-icon"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
              </div>
            </div>
            <h3 id="loadingMessage" className="loading-message">
              {loadingMessage}
              {dots}
            </h3>
            <p id="loadingDescription" className="loading-description">
              {loadingDescription}
            </p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
