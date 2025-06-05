"use client"

import { useState, useEffect } from "react"
import { PropertyCard } from "./property-card"
import { Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentlyViewedProperty {
  id: string
  title: string
  location: string
  price: number
  category: "buy" | "rent" | "shortlet"
  image: string
  viewedAt: string
}

interface RecentlyViewedProps {
  currentPropertyId?: string
}

export function RecentlyViewed({ currentPropertyId }: RecentlyViewedProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProperty[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load recently viewed properties from localStorage
    const stored = localStorage.getItem("recentlyViewedProperties")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Filter out current property and limit to 4 items
        const filtered = parsed.filter((item: RecentlyViewedProperty) => item.id !== currentPropertyId).slice(0, 4)
        setRecentlyViewed(filtered)
        setIsVisible(filtered.length > 0)
      } catch (e) {
        console.error("Error parsing recently viewed properties:", e)
      }
    }
  }, [currentPropertyId])

  const clearRecentlyViewed = () => {
    localStorage.removeItem("recentlyViewedProperties")
    setRecentlyViewed([])
    setIsVisible(false)
  }

  const removeProperty = (propertyId: string) => {
    const updated = recentlyViewed.filter((item) => item.id !== propertyId)
    setRecentlyViewed(updated)
    localStorage.setItem("recentlyViewedProperties", JSON.stringify(updated))

    if (updated.length === 0) {
      setIsVisible(false)
    }
  }

  if (!isVisible || recentlyViewed.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-hovmart-purple" />
          <h3 className="text-lg font-semibold text-gray-900">Recently Viewed</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearRecentlyViewed} className="text-gray-500 hover:text-gray-700">
            Clear all
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recentlyViewed.map((property) => (
          <div key={property.id} className="relative group">
            <PropertyCard
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price}
              priceType={property.category}
              image={property.image}
              propertyType="Property"
              priceSuffix={property.category === "buy" ? "" : property.category === "rent" ? "/month" : "/night"}
            />
            <button
              onClick={() => removeProperty(property.id)}
              className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <X className="h-3 w-3 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
