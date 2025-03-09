// DOM Elements
const searchForm = document.getElementById("searchForm")
const imageInput = document.getElementById("imageInput")
const searchText = document.getElementById("searchText")
const searchSpinner = document.getElementById("searchSpinner")
const resultsList = document.getElementById("resultsList")
const resultsContainer = document.querySelector(".results-container")
const loadingScreen = document.getElementById("loadingScreen")
const loadingMessage = document.getElementById("loadingMessage")
const loadingDescription = document.getElementById("loadingDescription")
const loadingIcon = document.getElementById("loadingIcon")
const loadingDots = document.getElementById("loadingDots")
const trendingProducts = document.getElementById("trendingProducts")

// Loading screen functionality
let dotsInterval

function showLoading(type = "search", message = "Searching for products") {
  // Set appropriate icon
  if (type === "search") {
    loadingIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`
    loadingDescription.textContent = "We're searching for the best prices across multiple stores."
  } else if (type === "upload") {
    loadingIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`
    loadingDescription.textContent = "Analyzing your image to find matching products."
  } else if (type === "navigation") {
    loadingIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg>`
    loadingDescription.textContent = "Please wait while we load the page."
  }

  // Set message
  loadingMessage.textContent = message
  loadingDots.textContent = ""

  // Start dots animation
  clearInterval(dotsInterval)
  dotsInterval = setInterval(() => {
    if (loadingDots.textContent.length >= 3) {
      loadingDots.textContent = ""
    } else {
      loadingDots.textContent += "."
    }
  }, 500)

  // Show loading screen
  loadingScreen.classList.add("visible")
}

function hideLoading() {
  loadingScreen.classList.remove("visible")
  clearInterval(dotsInterval)
}

// Search functionality
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const file = imageInput.files[0]
  if (!file) {
    alert("이미지를 선택해주세요.")
    return
  }

  // Show loading screen
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

    // Hide loading screen
    hideLoading()

    // Process response
    const text = await response.text()
    if (!text) {
      displayResults([]) // 빈 결과 처리
      return
    }

    const results = JSON.parse(text)
    displayResults(results)
  } catch (error) {
    hideLoading()
    alert(error.message)
    console.error("검색 오류:", error)
  }
})

// Display search results
function displayResults(results) {
  resultsList.innerHTML = ""

  if (results.length === 0) {
    resultsList.innerHTML = "<li>검색 결과가 없습니다.</li>"
  } else {
    results.forEach((result) => {
      const listItem = document.createElement("li")
      listItem.innerHTML = `
                <strong>${result.productName}</strong><br>
                가격: ${result.price}<br>
                <a href="${result.link}" target="_blank">구매 페이지로 이동</a>
            `
      resultsList.appendChild(listItem)
    })
  }

  // Show results container
  resultsContainer.classList.add("visible")
}

// Search input focus effects
searchText.addEventListener("focus", () => {
  searchSpinner.classList.add("visible")
})

searchText.addEventListener("blur", () => {
  if (!searchText.value) {
    searchSpinner.classList.remove("visible")
  }
})

// Initialize trending products
function initTrendingProducts() {
  const products = [
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

  trendingProducts.innerHTML = ""

  products.forEach((product) => {
    const productElement = document.createElement("a")
    productElement.href = "#"
    productElement.className = "trending-item"
    productElement.addEventListener("click", (e) => {
      e.preventDefault()
      showLoading("search", `Searching for ${product.name}`)

      // Simulate search delay
      setTimeout(() => {
        hideLoading()
        displayResults([
          {
            productName: product.name,
            price: "₩15,000",
            link: "#",
          },
          {
            productName: product.name + " (Alternative)",
            price: "₩12,500",
            link: "#",
          },
        ])
      }, 1500)
    })

    productElement.innerHTML = `
            <div class="trending-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="trending-details">
                <h3 class="trending-name">${product.name}</h3>
                <p class="trending-searches">${product.searches} recent searches</p>
            </div>
        `

    trendingProducts.appendChild(productElement)
  })
}

// Initialize the app
function init() {
  initTrendingProducts()
}

// Run initialization
init()

