"use client"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface SearchParams {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  propertyType: "buy" | "rent" | "shortlet"
}

interface EnhancedPropertySearchProps {
  onSearch: (params: SearchParams) => void
  initialParams?: Partial<SearchParams>
  propertyType: "buy" | "rent" | "shortlet"
}

export function EnhancedPropertySearch({ onSearch, initialParams, propertyType }: EnhancedPropertySearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: initialParams?.location || "",
    checkIn: initialParams?.checkIn || "",
    checkOut: initialParams?.checkOut || "",
    guests: initialParams?.guests || 1,
    propertyType,
  })

  const [activeField, setActiveField] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Popular locations for suggestions
  const popularLocations = [
    "Victoria Island, Lagos",
    "Lekki, Lagos",
    "Ikoyi, Lagos",
    "Yaba, Lagos",
    "Ikeja, Lagos",
    "Surulere, Lagos",
    "Ajah, Lagos",
    "Banana Island, Lagos",
  ]

  const filteredLocations = popularLocations.filter((location) =>
    location.toLowerCase().includes(searchParams.location.toLowerCase()),
  )

  useEffect(() => {
    setSearchParams((prev) => ({ ...prev, propertyType }))
  }, [propertyType])

  const handleLocationChange = (value: string) => {
    setSearchParams((prev) => ({ ...prev, location: value }))
    setShowSuggestions(value.length > 0)
  }

  const handleLocationSelect = (location: string) => {
    setSearchParams((prev) => ({ ...prev, location }))
    setShowSuggestions(false)
    setActiveField(null)
  }

  const handleSearch = () => {
    onSearch(searchParams)
    setActiveField(null)
    setShowSuggestions(false)
  }

  const getPlaceholderText = () => {
    switch (propertyType) {
      case "buy":
        return "Where do you want to buy?"
      case "rent":
        return "Where do you want to rent?"
      case "shortlet":
        return "Where are you going?"
      default:
        return "Search location..."
    }
  }

  const getDateLabel = () => {
    switch (propertyType) {
      case "shortlet":
        return "Check-in / Check-out"
      case "rent":
        return "Move-in date"
      default:
        return "Viewing date"
    }
  }

  const getGuestLabel = () => {
    switch (propertyType) {
      case "shortlet":
        return "Guests"
      case "rent":
        return "Occupants"
      default:
        return "Viewers"
    }
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="bg-white rounded-2xl lg:rounded-full shadow-lg border border-gray-200 p-2 lg:p-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:divide-x lg:divide-gray-200 gap-2 lg:gap-0">
          {/* Location Search */}
          <div className="flex-1 relative">
            <div className="flex items-center px-4 py-3">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={searchParams.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => {
                    setActiveField("location")
                    setShowSuggestions(true)
                  }}
                  placeholder={getPlaceholderText()}
                  className="w-full text-sm text-gray-900 placeholder-gray-500 border-0 p-0 focus:outline-none focus:ring-0 bg-transparent truncate"
                />
              </div>
            </div>

            {/* Location Suggestions */}
            <AnimatePresence>
              {showSuggestions && activeField === "location" && filteredLocations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto"
                >
                  {filteredLocations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">{location}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Selection - Only show for shortlet and rent */}
          {(propertyType === "shortlet" || propertyType === "rent") && (
            <div className="flex-1 lg:min-w-0">
              <div className="flex items-center px-4 py-3">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-gray-700 mb-1">{getDateLabel()}</label>
                  <input
                    type="date"
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams((prev) => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full text-sm text-gray-900 border-0 p-0 focus:outline-none focus:ring-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Guests/Occupants */}
          <div className="flex-1 lg:min-w-0">
            <div className="flex items-center px-4 py-3">
              <Users className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 mb-1">{getGuestLabel()}</label>
                <select
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, guests: Number.parseInt(e.target.value) }))}
                  className="w-full text-sm text-gray-900 border-0 p-0 focus:outline-none focus:ring-0 bg-transparent appearance-none cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "person" : "people"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:pl-2 w-full lg:w-auto">
            <Button
              onClick={handleSearch}
              className="w-full lg:w-auto bg-hovmart-purple hover:bg-hovmart-light text-white rounded-xl lg:rounded-full px-6 py-3 h-auto flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
