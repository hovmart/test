"use client"

import { useState } from "react"
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

interface SearchFilters {
  query: string
  location: string
  priceMin: string
  priceMax: string
  propertyType: string
  bedrooms: string
  bathrooms: string
}

const locations = [
  "Victoria Island, Lagos",
  "Lekki Phase 1, Lagos",
  "Ikoyi, Lagos",
  "Ikeja, Lagos",
  "Yaba, Lagos",
  "Abuja, FCT",
  "Port Harcourt, Rivers",
]

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Studio", "Duplex", "Townhouse"]

export function PropertySearch({ onSearch, initialFilters }: PropertySearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    priceMin: "",
    priceMax: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    ...initialFilters,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = async () => {
    setIsSearching(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate search delay
    onSearch(filters)
    setIsSearching(false)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      location: "",
      priceMin: "",
      priceMax: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      {/* Main Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        {/* Search Query */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search properties..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 focus:border-hovmart-purple/30 transition-all duration-300"
            value={filters.query}
            onChange={(e) => handleFilterChange("query", e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 focus:border-hovmart-purple/30 transition-all duration-300 appearance-none bg-white"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="md:col-span-3 relative">
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 focus:border-hovmart-purple/30 transition-all duration-300 appearance-none bg-white"
            value={filters.propertyType}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
          >
            <option value="">Property Type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2">
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-gradient-to-r from-hovmart-purple to-hovmart-light text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:shadow-hovmart-purple/25 transition-all duration-300 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Searching...
              </div>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-hovmart-purple transition-colors duration-300"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors duration-300"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₦)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm appearance-none bg-white"
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm appearance-none bg-white"
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-hovmart-purple hover:bg-hovmart-light text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
