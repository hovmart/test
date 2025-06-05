"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, MapPin, Bed, Bath, SquareIcon as SquareFoot } from "lucide-react"
import { useState, useEffect } from "react"
import { createClientSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface Property {
  id: string
  title: string
  location: string
  price: number
  priceType?: "buy" | "rent" | "shortlet"
  category?: "buy" | "rent" | "shortlet"
  images?: string[]
  rating?: number
  reviewCount?: number
  review_count?: number
  available?: boolean
  type?: string
  propertyType?: string
  property_type?: string
  beds?: number
  baths?: number
  bedrooms?: number
  bathrooms?: number
  maxGuests?: number
  max_guests?: number
  amenities?: string[]
  categories?: string[]
  featured?: boolean
  isSuperhost?: boolean
  isGuestFavorite?: boolean
  square_feet?: number
}

interface PropertyCardProps {
  property?: Property
  // Legacy props for backward compatibility
  id?: string
  title?: string
  location?: string
  price?: number
  priceType?: "buy" | "rent" | "shortlet"
  image?: string
  propertyType?: string
  rating?: number
  reviewCount?: number
  isFavorite?: boolean
  isSuperhost?: boolean
  isGuestFavorite?: boolean
  priceSuffix?: string
}

export function PropertyCard({
  property,
  // Legacy props
  id,
  title,
  location,
  price,
  priceType,
  image,
  propertyType,
  rating,
  reviewCount,
  isFavorite: initialIsFavorite = false,
  isSuperhost = false,
  isGuestFavorite = false,
  priceSuffix = "",
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientSupabaseClient()
  const supabaseConfigured = isSupabaseConfigured()
  const [hasCheckedFavorite, setHasCheckedFavorite] = useState(false)

  // Use property object if available, otherwise use legacy props
  const propertyData = property || {
    id: id || "",
    title: title || "",
    location: location || "",
    price: price || 0,
    category: priceType || "buy",
    images: image ? [image] : [],
    rating: rating || 0,
    review_count: reviewCount || 0,
    property_type: propertyType || "",
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    amenities: [],
    featured: false,
  }

  // Early return if no valid property data
  if (!propertyData.id || !propertyData.title) {
    return null
  }

  // Check if property is in user's favorites when component mounts
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !propertyData.id || !supabaseConfigured || hasCheckedFavorite) return

      try {
        const { data } = await supabase
          .from("favorites")
          .select("id")
          .eq("property_id", propertyData.id)
          .eq("user_id", user.id)
          .single()

        setIsFavorite(!!data)
      } catch (error) {
        // Silently handle error - user might not have favorites yet
        console.log("No favorites found or error checking favorites")
      } finally {
        setHasCheckedFavorite(true)
      }
    }

    checkFavorite()
  }, [user, propertyData.id, supabase, supabaseConfigured, hasCheckedFavorite])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save properties to favorites",
        variant: "destructive",
      })
      return
    }

    if (!propertyData.id) {
      toast({
        title: "Error",
        description: "Invalid property data",
        variant: "destructive",
      })
      return
    }

    if (!supabaseConfigured) {
      // Mock favorite toggle for demo purposes
      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: "Demo mode - favorites not persisted",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase.from("favorites").delete().eq("property_id", propertyData.id).eq("user_id", user.id)

        toast({
          title: "Removed from favorites",
          description: "Property has been removed from your favorites",
        })
      } else {
        // Add to favorites
        await supabase.from("favorites").insert({
          property_id: propertyData.id,
          user_id: user.id,
        })

        toast({
          title: "Added to favorites",
          description: "Property has been added to your favorites",
        })
      }

      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0) return "Price on request"

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPriceSuffix = (category: string) => {
    switch (category) {
      case "rent":
        return "/month"
      case "shortlet":
        return "/night"
      default:
        return ""
    }
  }

  const displayRating = propertyData.rating || rating || 0
  const displayReviewCount = propertyData.review_count || reviewCount || 0
  const displayImage = propertyData.images?.[0] || image || "/placeholder.svg?height=256&width=384"
  const displayPropertyType = propertyData.property_type || propertyType || "Property"
  const displayBedrooms = propertyData.bedrooms || propertyData.beds || 0
  const displayBathrooms = propertyData.bathrooms || propertyData.baths || 0

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageSrc = () => {
    if (imageError) {
      return "/placeholder.svg?height=256&width=384"
    }
    return displayImage
  }

  return (
    <Link href={`/properties/${propertyData.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100">
        {/* Image container */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={getImageSrc() || "/placeholder.svg"}
            alt={propertyData.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
          />

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
              isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""} shadow-sm`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          {/* Property category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full shadow-sm ${
                propertyData.category === "buy"
                  ? "bg-green-100 text-green-800"
                  : propertyData.category === "rent"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
              }`}
            >
              {propertyData.category === "buy"
                ? "For Sale"
                : propertyData.category === "rent"
                  ? "For Rent"
                  : "Shortlet"}
            </span>
          </div>

          {/* Featured badge */}
          {propertyData.featured && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded-full shadow-sm">
                Featured
              </span>
            </div>
          )}

          {/* Special badges */}
          {(isSuperhost || isGuestFavorite) && (
            <div className="absolute bottom-3 right-3 flex gap-2 z-10">
              {isSuperhost && (
                <span className="bg-purple-600 text-white px-2 py-1 text-xs font-medium rounded-full shadow-sm">
                  Superhost
                </span>
              )}
              {isGuestFavorite && (
                <span className="bg-amber-500 text-white px-2 py-1 text-xs font-medium rounded-full shadow-sm">
                  Guest Favorite
                </span>
              )}
            </div>
          )}

          {/* Demo mode indicator */}
          {!supabaseConfigured && (
            <div className="absolute top-3 right-14 z-10">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded-full shadow-sm">
                Demo
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Price */}
          <div className="mb-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(propertyData.price)}</span>
            <span className="text-gray-500 text-sm ml-1">
              {priceSuffix || getPriceSuffix(propertyData.category || "")}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
            {propertyData.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{propertyData.location}</span>
          </div>

          {/* Property details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              {displayBedrooms > 0 && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{displayBedrooms}</span>
                </div>
              )}
              {displayBathrooms > 0 && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{displayBathrooms}</span>
                </div>
              )}
              {propertyData.square_feet && propertyData.square_feet > 0 && (
                <div className="flex items-center">
                  <SquareFoot className="h-4 w-4 mr-1" />
                  <span>{propertyData.square_feet.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating and reviews */}
          {displayRating > 0 && (
            <div className="flex items-center mb-3">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium text-gray-900">{displayRating.toFixed(1)}</span>
              {displayReviewCount > 0 && (
                <span className="text-sm text-gray-600 ml-1">({displayReviewCount} reviews)</span>
              )}
            </div>
          )}

          {/* Property type */}
          <div className="mt-auto">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{displayPropertyType}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
