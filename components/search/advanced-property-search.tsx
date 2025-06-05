"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, Filter, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchSuggestion {
  objectID: string
  title: string
  location: string
  city: string
  category: string
  _highlightResult?: any
}

interface AdvancedPropertySearchProps {
  onSearch: (query: string, filters: any) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  placeholder?: string
  showFilters?: boolean
}

export function AdvancedPropertySearch({
  onSearch,
  onSuggestionSelect,
  placeholder = "Search properties, locations, or amenities...",
  showFilters = true,
}: AdvancedPropertySearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  // Advanced filters state
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    bathrooms: "",
    property_type: "",
    amenities: [] as string[],
    verified: false,
    featured: false,
  })

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=8`)
        const data = await response.json()

        if (data.success) {
          setSuggestions(data.suggestions)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    const searchFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0
        return value !== "" && value !== false
      }),
    )

    onSearch(query, searchFilters)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    onSuggestionSelect?.(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      priceMin: "",
      priceMax: "",
      bedrooms: "",
      bathrooms: "",
      property_type: "",
      amenities: [],
      verified: false,
      featured: false,
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) return value.length > 0
    return value !== "" && value !== false
  })

  return (
    <div className="w-full max-w-4xl mx-auto" ref={searchRef}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder={placeholder}
              className="pl-12 pr-4 py-4 border-0 focus:ring-0 text-lg bg-transparent"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              </div>
            )}
          </div>

          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`mx-2 ${hasActiveFilters ? "text-hovmart-purple bg-hovmart-purple/10" : ""}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-hovmart-purple text-white text-xs rounded-full px-2 py-1">
                  {
                    Object.values(filters).filter((v) => (Array.isArray(v) ? v.length > 0 : v !== "" && v !== false))
                      .length
                  }
                </span>
              )}
            </Button>
          )}

          <Button
            onClick={handleSearch}
            className="bg-hovmart-purple hover:bg-hovmart-light text-white px-8 py-4 rounded-none rounded-r-2xl"
          >
            Search
          </Button>
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.objectID}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center"
                >
                  <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium text-gray-900 truncate"
                      dangerouslySetInnerHTML={{
                        __html: suggestion._highlightResult?.title?.value || suggestion.title,
                      }}
                    />
                    <div
                      className="text-sm text-gray-500 truncate"
                      dangerouslySetInnerHTML={{
                        __html: suggestion._highlightResult?.location?.value || suggestion.location,
                      }}
                    />
                  </div>
                  <span className="text-xs text-hovmart-purple bg-hovmart-purple/10 px-2 py-1 rounded-full ml-2">
                    {suggestion.category}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-red-500">
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-hovmart-purple focus:border-hovmart-purple"
                >
                  <option value="">All Categories</option>
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="shortlet">Short-term Rental</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.property_type}
                  onChange={(e) => setFilters((prev) => ({ ...prev, property_type: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-hovmart-purple focus:border-hovmart-purple"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="studio">Studio</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-hovmart-purple focus:border-hovmart-purple"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Bathrooms</label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => setFilters((prev) => ({ ...prev, bathrooms: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-hovmart-purple focus:border-hovmart-purple"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₦)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.priceMin}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
                    className="focus:ring-hovmart-purple focus:border-hovmart-purple"
                  />
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.priceMax}
                    onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
                    className="focus:ring-hovmart-purple focus:border-hovmart-purple"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => setFilters((prev) => ({ ...prev, verified: e.target.checked }))}
                    className="rounded border-gray-300 text-hovmart-purple focus:ring-hovmart-purple"
                  />
                  <span className="ml-2 text-sm text-gray-700">Verified Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => setFilters((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-hovmart-purple focus:ring-hovmart-purple"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSearch} className="bg-hovmart-purple hover:bg-hovmart-light text-white px-6 py-2">
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
