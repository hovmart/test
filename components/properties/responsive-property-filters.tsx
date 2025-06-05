"use client"

import { useState } from "react"
import { X, Check, ChevronDown, ChevronUp, Filter, SlidersHorizontal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

interface PropertyFiltersProps {
  onApplyFilters: (filters: any) => void
  initialFilters?: any
  totalProperties?: number
  isLoading?: boolean
}

export function ResponsivePropertyFilters({
  onApplyFilters,
  initialFilters = {},
  totalProperties = 0,
  isLoading = false,
}: PropertyFiltersProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isOpen, setIsOpen] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000000 },
    propertyTypes: [],
    amenities: [],
    bedrooms: "",
    bathrooms: "",
    location: "",
    ...initialFilters,
  })

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    type: true,
    rooms: true,
    amenities: false,
    location: true,
  })

  // Property types with icons
  const propertyTypes = [
    { id: "apartment", label: "Apartment", icon: "🏢" },
    { id: "house", label: "House", icon: "🏠" },
    { id: "villa", label: "Villa", icon: "🏖️" },
    { id: "condo", label: "Condo", icon: "🏘️" },
    { id: "townhouse", label: "Townhouse", icon: "🏘️" },
    { id: "penthouse", label: "Penthouse", icon: "🏙️" },
    { id: "studio", label: "Studio", icon: "🏠" },
    { id: "cottage", label: "Cottage", icon: "🏡" },
  ]

  // Popular amenities
  const amenities = [
    "Wi-Fi",
    "Air conditioning",
    "Kitchen",
    "Washing machine",
    "Pool",
    "Free parking",
    "Gym",
    "TV",
    "Balcony",
    "Beachfront",
    "Pet friendly",
    "Wheelchair accessible",
    "Garden",
    "Security",
    "Generator",
    "Elevator",
    "Furnished",
    "Serviced",
  ]

  // Popular locations in Lagos
  const locations = [
    "Victoria Island",
    "Lekki",
    "Ikoyi",
    "Yaba",
    "Ikeja",
    "Surulere",
    "Ajah",
    "Banana Island",
    "Gbagada",
    "Magodo",
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const togglePropertyType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }))
  }

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    const resetState = {
      priceRange: { min: 0, max: 10000000 },
      propertyTypes: [],
      amenities: [],
      bedrooms: "",
      bathrooms: "",
      location: "",
    }
    setFilters(resetState)
    onApplyFilters(resetState)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000000) count++
    if (filters.propertyTypes.length > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.bedrooms) count++
    if (filters.bathrooms) count++
    if (filters.location) count++
    return count
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full text-left">
          <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
          {expandedSections.price ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, min: Number(e.target.value) },
                        }))
                      }
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: Number(e.target.value) },
                        }))
                      }
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="10,000,000"
                    />
                  </div>
                </div>
              </div>

              {/* Quick price ranges */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Under ₦100K", min: 0, max: 100000 },
                  { label: "₦100K - ₦500K", min: 100000, max: 500000 },
                  { label: "₦500K - ₦1M", min: 500000, max: 1000000 },
                  { label: "₦1M+", min: 1000000, max: 10000000 },
                ].map((range) => (
                  <Button
                    key={range.label}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: { min: range.min, max: range.max },
                      }))
                    }
                    className={`text-xs ${
                      filters.priceRange.min === range.min && filters.priceRange.max === range.max
                        ? "bg-purple-100 border-purple-500 text-purple-700"
                        : ""
                    }`}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Property Type */}
      <div className="space-y-4">
        <button onClick={() => toggleSection("type")} className="flex items-center justify-between w-full text-left">
          <h3 className="text-lg font-semibold text-gray-900">Property Type</h3>
          {expandedSections.type ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.type && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-2 gap-2"
            >
              {propertyTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  size="sm"
                  onClick={() => togglePropertyType(type.id)}
                  className={`justify-start text-left ${
                    filters.propertyTypes.includes(type.id) ? "bg-purple-100 border-purple-500 text-purple-700" : ""
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                  {filters.propertyTypes.includes(type.id) && <Check className="h-4 w-4 ml-auto" />}
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rooms */}
      <div className="space-y-4">
        <button onClick={() => toggleSection("rooms")} className="flex items-center justify-between w-full text-left">
          <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
          {expandedSections.rooms ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.rooms && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {["Any", "1", "2", "3", "4", "5+"].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters((prev) => ({ ...prev, bedrooms: num === "Any" ? "" : num }))}
                      className={`${
                        filters.bedrooms === (num === "Any" ? "" : num)
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : ""
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <div className="flex flex-wrap gap-2">
                  {["Any", "1", "2", "3", "4", "5+"].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters((prev) => ({ ...prev, bathrooms: num === "Any" ? "" : num }))}
                      className={`${
                        filters.bathrooms === (num === "Any" ? "" : num)
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : ""
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("location")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          {expandedSections.location ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <Button
                    key={location}
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, location }))}
                    className={`text-xs ${
                      filters.location === location ? "bg-purple-100 border-purple-500 text-purple-700" : ""
                    }`}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amenities */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("amenities")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
          {expandedSections.amenities ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.amenities && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto"
            >
              {amenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button variant="outline" onClick={resetFilters} className="flex-1">
          Clear All
        </Button>
        <Button
          onClick={handleApplyFilters}
          disabled={isLoading}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading ? "Loading..." : `Show ${totalProperties} Properties`}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="relative">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-purple-600">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Filter Properties</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <FilterContent />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {getActiveFiltersCount() > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-purple-600">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FilterContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
