"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyCategoryFilter } from "@/components/properties/property-category-filter"
import { PropertyGrid } from "@/components/properties/property-grid"
import { PropertyFilters } from "@/components/properties/property-filters"
import { Filter, X, Search, Home, Building, Clock, Grid3X3, List, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { EnhancedPropertySearch } from "@/components/properties/enhanced-property-search"
import { PropertyStats } from "@/components/properties/property-stats"
import { PropertyListView } from "@/components/properties/property-list-view"
import { PropertyPagination } from "@/components/ui/pagination"
import { RecentlyViewed } from "@/components/properties/recently-viewed"
import { useDebounce } from "@/hooks/use-debounce"
import { useProperties } from "@/hooks/use-properties"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface GuestCounts {
  adults: number
  children: number
  infants: number
}

interface SearchParams {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  guestDetails?: GuestCounts
  isFlexibleDates?: boolean
  flexibleOption?: string | null
}

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [activePropertyType, setActivePropertyType] = useState<"buy" | "rent" | "shortlet">(
    (searchParams.get("category") as "buy" | "rent" | "shortlet") || "buy",
  )

  const [searchParamsState, setSearchParamsState] = useState<SearchParams>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 0,
    guestDetails: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    isFlexibleDates: false,
    flexibleOption: null,
  })

  const [activeCategory, setActiveCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 })
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [isMobileView, setIsMobileView] = useState(false)
  const [selectedBeds, setSelectedBeds] = useState("")
  const [selectedBaths, setSelectedBaths] = useState("")

  const [currentView, setCurrentView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  // Debounce search params for better performance
  const debouncedSearchParams = useDebounce(searchParamsState, 300)

  const {
    data: propertiesData = [],
    isLoading,
    error,
    refetch,
  } = useProperties({
    category: activePropertyType,
    location: debouncedSearchParams.location,
    search: debouncedSearchParams.location, // Use location as search term
    priceRange: priceRange.min > 0 || priceRange.max < 1000000 ? priceRange : undefined,
    propertyType: selectedPropertyTypes.length > 0 ? selectedPropertyTypes[0] : undefined,
    sortBy,
    limit: 50, // Get more properties for client-side filtering
  })

  // Apply additional client-side filters
  const filteredProperties = useMemo(() => {
    return propertiesData.filter((property: any) => {
      // Filter by guest count
      if (debouncedSearchParams.guests > 0) {
        if (!property.max_guests || property.max_guests < debouncedSearchParams.guests) return false
      }

      // Filter by category
      if (activeCategory !== "all") {
        if (!property.categories || !property.categories.includes(activeCategory)) return false
      }

      // Filter by amenities
      if (selectedAmenities.length > 0) {
        if (!selectedAmenities.every((amenity) => property.amenities && property.amenities.includes(amenity)))
          return false
      }

      // Filter by beds
      if (selectedBeds) {
        const bedsCount = selectedBeds === "5+" ? 5 : Number.parseInt(selectedBeds)
        if (!property.bedrooms || property.bedrooms < bedsCount) return false
      }

      // Filter by baths
      if (selectedBaths) {
        const bathsCount = selectedBaths === "5+" ? 5 : Number.parseInt(selectedBaths)
        if (!property.bathrooms || property.bathrooms < bathsCount) return false
      }

      return true
    })
  }, [propertiesData, debouncedSearchParams, activeCategory, selectedAmenities, selectedBeds, selectedBaths])

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProperties.slice(startIndex, endIndex)
  }, [filteredProperties, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)

  const handleSearch = (params: SearchParams) => {
    setSearchParamsState(params)
    setCurrentPage(1)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handleFilterChange = (filters: any) => {
    setPriceRange(filters.priceRange)
    setSelectedPropertyTypes(filters.propertyTypes || [])
    setSelectedAmenities(filters.amenities || [])
    setSelectedBeds(filters.beds || "")
    setSelectedBaths(filters.baths || "")
    setShowFilters(false)
    setCurrentPage(1)
  }

  const handleTabChange = (value: "buy" | "rent" | "shortlet") => {
    setActivePropertyType(value)
    setCurrentPage(1)
    const url = new URL(window.location.href)
    url.searchParams.set("category", value)
    window.history.pushState({}, "", url.toString())
  }

  const calculateAveragePrice = (properties: any[]) => {
    if (properties.length === 0) return 0
    const total = properties.reduce((sum, property) => sum + property.price, 0)
    return total / properties.length
  }

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Failed to load properties. Please try again.</span>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Enhanced Search Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <EnhancedPropertySearch
            onSearch={handleSearch}
            propertyType={activePropertyType}
            initialParams={searchParamsState}
          />
        </div>

        {/* Property Type Tabs */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <Tabs value={activePropertyType} onValueChange={handleTabChange} className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="h-14 bg-transparent w-full justify-start gap-2 mb-0 pb-0">
                <TabsTrigger
                  value="buy"
                  className={cn(
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 text-base font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-hovmart-purple transition-all",
                    "flex items-center gap-2",
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span>Buy</span>
                </TabsTrigger>
                <TabsTrigger
                  value="rent"
                  className={cn(
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 text-base font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-hovmart-purple transition-all",
                    "flex items-center gap-2",
                  )}
                >
                  <Building className="h-5 w-5" />
                  <span>Rent</span>
                </TabsTrigger>
                <TabsTrigger
                  value="shortlet"
                  className={cn(
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none h-12 px-6 text-base font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-hovmart-purple transition-all",
                    "flex items-center gap-2",
                  )}
                >
                  <Clock className="h-5 w-5" />
                  <span>Shortlet</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="buy" className="mt-6">
              <PropertyStats
                propertyType="buy"
                totalProperties={filteredProperties.length}
                averagePrice={calculateAveragePrice(filteredProperties)}
                featuredCount={filteredProperties.filter((p) => p.featured).length}
              />
              <PropertyCategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            </TabsContent>

            <TabsContent value="rent" className="mt-6">
              <PropertyStats
                propertyType="rent"
                totalProperties={filteredProperties.length}
                averagePrice={calculateAveragePrice(filteredProperties)}
                featuredCount={filteredProperties.filter((p) => p.featured).length}
              />
              <PropertyCategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            </TabsContent>

            <TabsContent value="shortlet" className="mt-6">
              <PropertyStats
                propertyType="shortlet"
                totalProperties={filteredProperties.length}
                averagePrice={calculateAveragePrice(filteredProperties)}
                featuredCount={filteredProperties.filter((p) => p.featured).length}
              />
              <PropertyCategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Enhanced Filters Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {filteredProperties.length} {filteredProperties.length === 1 ? "Property" : "Properties"} Available
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {activePropertyType === "buy" && "Properties for sale"}
                {activePropertyType === "rent" && "Properties for rent"}
                {activePropertyType === "shortlet" && "Short-term rental properties"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hovmart-purple/30"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="views">Most Popular</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCurrentView("grid")}
                  className={cn(
                    "px-3 py-2 text-sm flex items-center gap-1 transition-colors",
                    currentView === "grid" ? "bg-hovmart-purple text-white" : "bg-white text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setCurrentView("list")}
                  className={cn(
                    "px-3 py-2 text-sm flex items-center gap-1 transition-colors",
                    currentView === "list" ? "bg-hovmart-purple text-white" : "bg-white text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-hovmart-purple/50 transition-colors relative shadow-sm bg-white"
              >
                <Filter className="h-4 w-4 text-hovmart-purple" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-hovmart-purple text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Filters (Full Screen) */}
          {showFilters && (
            <div className="fixed inset-0 bg-white z-50 overflow-y-auto scroll-smooth lg:relative lg:inset-auto lg:bg-transparent lg:z-auto lg:overflow-visible">
              <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 lg:p-0">
                <PropertyFilters
                  onClose={() => setShowFilters(false)}
                  onApplyFilters={handleFilterChange}
                  initialPriceRange={priceRange}
                  initialPropertyTypes={selectedPropertyTypes}
                  initialAmenities={selectedAmenities}
                  totalProperties={filteredProperties.length}
                />
              </div>
            </div>
          )}

          {/* No Results Message */}
          {filteredProperties.length === 0 && !isLoading && !error && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any properties matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
              <Button
                onClick={() => {
                  setActiveCategory("all")
                  setSearchParamsState({
                    location: "",
                    checkIn: "",
                    checkOut: "",
                    guests: 0,
                    guestDetails: { adults: 1, children: 0, infants: 0 },
                    isFlexibleDates: false,
                    flexibleOption: null,
                  })
                  setPriceRange({ min: 0, max: 1000000 })
                  setSelectedPropertyTypes([])
                  setSelectedAmenities([])
                  setSelectedBeds("")
                  setSelectedBaths("")
                }}
                className="mt-4 bg-hovmart-purple hover:bg-hovmart-purple/90"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Recently Viewed Properties */}
          <RecentlyViewed />

          {/* Property Grid/List */}
          {currentView === "grid" ? (
            <PropertyGrid properties={paginatedProperties} isLoading={isLoading} propertyType={activePropertyType} />
          ) : (
            <PropertyListView
              properties={paginatedProperties}
              isLoading={isLoading}
              propertyType={activePropertyType}
            />
          )}

          {/* Pagination */}
          {filteredProperties.length > itemsPerPage && (
            <div className="mt-8">
              <PropertyPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
