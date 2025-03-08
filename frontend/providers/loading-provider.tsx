"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { LoadingScreen } from "@/components/loading-screen"

type LoadingType = "navigation" | "search" | "upload"

interface LoadingContextType {
  showLoading: (type?: LoadingType, message?: string) => void
  hideLoading: () => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<LoadingType>("navigation")
  const [loadingMessage, setLoadingMessage] = useState("Loading...")

  const showLoading = (type: LoadingType = "navigation", message = "Loading...") => {
    setLoadingType(type)
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      <LoadingScreen isVisible={isLoading} type={loadingType} message={loadingMessage} />
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}

