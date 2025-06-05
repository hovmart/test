"use client"

import { PropertyCard } from "./property-card"
import { useProperties } from "@/hooks/use-properties"
import { PropertyListingSkeleton } from "./property-listing-skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info, RefreshCw } from "lucide-react"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { mockProperties } from "@/data/properties"
import { Button } from "@/components/ui/button"

interface PropertyGridProps {
  category?: string
  location?: string
  search?: string
  filters?: {
    priceRange?: { min: number; max: number }
    propertyType?: string
    bedrooms?: string
    bathrooms?: string
    amenities?: string[]
    sortBy?: string
  }
  limit?: number
  className?: string
}

export function PropertyGrid({ category, location, search, filters, limit = 12, className = "" }: PropertyGridProps) {
  const supabaseConfigured = isSupabaseConfigured()

  const {
    data: properties,
    isLoading,
    error,
  } = useProperties({
    category,
    location,
    search,
    ...filters,
    limit,
  })

  // Filter mock data based on category
  const filteredMockProperties = mockProperties.filter((p) => {
    if (category && p.category !== category) return false
    if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(searchLower) ||
        p.location.toLowerCase().includes(searchLower) ||
        p.property_type?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  // Use mock data if Supabase is not configured
  const displayProperties = supabaseConfigured ? properties : filteredMockProperties.slice(0, limit)

  // Loading state
  if (isLoading && supabaseConfigured) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-600" />
            <span className="text-sm text-blue-800">Loading properties...</span>
          </div>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
          {Array.from({ length: limit }).map((_, index) => (
            <PropertyListingSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error && supabaseConfigured) {
    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mb-4">
            Failed to load properties. Please check your connection and try again.
          </AlertDescription>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  // Empty state
  if (!displayProperties || displayProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {category
              ? `No ${category} properties found matching your criteria.`
              : "We couldn't find any properties matching your criteria."}
          </p>
          <p className="text-sm text-gray-500">Try adjusting your filters or search terms, or browse all properties.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo mode notice */}
      {!supabaseConfigured && (
        <Alert className="bg-orange-50 border-orange-200">
          <Info className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Demo Mode:</strong> Showing sample properties. Set up your Supabase environment variables to enable
            full functionality with real data.
          </AlertDescription>
        </Alert>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {displayProperties.length} {displayProperties.length === 1 ? "property" : "properties"}
          {category && ` for ${category}`}
        </p>
        {!supabaseConfigured && (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Demo Data</span>
        )}
      </div>

      {/* Property grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {displayProperties.map((property, index) => (
          <PropertyCard
            key={`${property.id}-${index}`}
            property={{
              id: property.id,
              title: property.title,
              location: property.location,
              price: property.price,
              category: property.category,
              images: property.images || [],
              rating: property.rating || 0,
              review_count: property.review_count || 0,
              property_type: property.property_type || "Property",
              bedrooms: property.bedrooms || 0,
              bathrooms: property.bathrooms || 0,
              square_feet: property.square_feet || 0,
              amenities: property.amenities || [],
              featured: property.featured || false,
              available: property.available !== false, // Default to true if not specified
            }}
          />
        ))}
      </div>

      {/* Load more button for demo mode */}
      {!supabaseConfigured && filteredMockProperties.length > displayProperties.length && (
        <div className="text-center pt-6">
          <Button variant="outline" disabled>
            Load More Properties
            <span className="ml-2 text-xs">(Available in full version)</span>
          </Button>
        </div>
      )}
    </div>
  )
}
