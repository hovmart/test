"use client"

import { useState, useEffect } from "react"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { mockProperties } from "@/data/properties"

interface UsePropertiesParams {
  category?: string
  location?: string
  search?: string
  priceRange?: { min: number; max: number }
  propertyType?: string
  bedrooms?: string
  bathrooms?: string
  amenities?: string[]
  sortBy?: string
  limit?: number
}

interface Property {
  id: string
  title: string
  location: string
  price: number
  category: string
  images?: string[]
  rating?: number
  review_count?: number
  property_type?: string
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  amenities?: string[]
  featured?: boolean
  available?: boolean
}

export function useProperties(params: UsePropertiesParams = {}) {
  const [data, setData] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (!isSupabaseConfigured()) {
          // Use mock data when Supabase is not configured
          let filteredProperties = [...mockProperties]

          // Apply filters to mock data
          if (params.category) {
            filteredProperties = filteredProperties.filter((p) => p.category === params.category)
          }

          if (params.search) {
            const searchLower = params.search.toLowerCase()
            filteredProperties = filteredProperties.filter(
              (p) => p.title.toLowerCase().includes(searchLower) || p.location.toLowerCase().includes(searchLower),
            )
          }

          if (params.location) {
            filteredProperties = filteredProperties.filter((p) =>
              p.location.toLowerCase().includes(params.location!.toLowerCase()),
            )
          }

          if (params.priceRange) {
            filteredProperties = filteredProperties.filter(
              (p) => p.price >= params.priceRange!.min && p.price <= params.priceRange!.max,
            )
          }

          if (params.propertyType) {
            filteredProperties = filteredProperties.filter((p) => p.property_type === params.propertyType)
          }

          if (params.bedrooms) {
            const beds = Number.parseInt(params.bedrooms)
            filteredProperties = filteredProperties.filter((p) => (p.bedrooms || 0) >= beds)
          }

          if (params.bathrooms) {
            const baths = Number.parseInt(params.bathrooms)
            filteredProperties = filteredProperties.filter((p) => (p.bathrooms || 0) >= baths)
          }

          // Apply sorting
          if (params.sortBy) {
            switch (params.sortBy) {
              case "price-asc":
                filteredProperties.sort((a, b) => a.price - b.price)
                break
              case "price-desc":
                filteredProperties.sort((a, b) => b.price - a.price)
                break
              case "rating":
                filteredProperties.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                break
              case "newest":
                // Mock newest sort
                break
            }
          }

          // Apply limit
          if (params.limit) {
            filteredProperties = filteredProperties.slice(0, params.limit)
          }

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500))

          setData(filteredProperties)
        } else {
          // Use real API when Supabase is configured
          const searchParams = new URLSearchParams()

          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (typeof value === "object") {
                searchParams.append(key, JSON.stringify(value))
              } else {
                searchParams.append(key, value.toString())
              }
            }
          })

          const response = await fetch(`/api/properties?${searchParams}`)

          if (!response.ok) {
            throw new Error("Failed to fetch properties")
          }

          const result = await response.json()
          setData(result.properties || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        // Fallback to mock data on error
        setData(mockProperties.slice(0, params.limit || 12))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [
    params.category,
    params.location,
    params.search,
    params.priceRange,
    params.propertyType,
    params.bedrooms,
    params.bathrooms,
    params.amenities,
    params.sortBy,
    params.limit,
    params,
  ])

  return { data, isLoading, error }
}
