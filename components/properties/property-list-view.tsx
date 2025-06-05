"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, MapPin, Bed, Bath, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface Property {
  id: string
  title: string
  location: string
  price: number
  category: "buy" | "rent" | "shortlet"
  images: string[]
  rating?: number
  reviewCount?: number
  bedrooms?: number
  bathrooms?: number
  maxGuests?: number
  amenities?: string[]
  propertyType?: string
  featured?: boolean
  description?: string
  createdAt?: string
}

interface PropertyListViewProps {
  properties: Property[]
  isLoading?: boolean
  propertyType: "buy" | "rent" | "shortlet"
}

export function PropertyListView({ properties, isLoading, propertyType }: PropertyListViewProps) {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPriceSuffix = (type: "buy" | "rent" | "shortlet") => {
    switch (type) {
      case "buy":
        return ""
      case "rent":
        return "/month"
      case "shortlet":
        return "/night"
      default:
        return ""
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently added"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
          <Link href={`/properties/${property.id}`} className="block">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-64 h-48 sm:h-40 flex-shrink-0">
                <Image
                  src={property.images[0] || "/placeholder.svg?height=200&width=300"}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Favorite button */}
                <button
                  onClick={(e) => toggleFavorite(property.id, e)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors z-10 ${
                    favorites.includes(property.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600 hover:bg-white"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? "fill-white" : ""}`} />
                </button>

                {/* Property type badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                  {property.propertyType || "Property"}
                </div>

                {/* Featured badge */}
                {property.featured && (
                  <div className="absolute bottom-3 left-3 bg-hovmart-purple text-white px-2 py-1 rounded-md text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-hovmart-purple transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.location}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  {property.rating && (
                    <div className="flex items-center ml-4">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                      <span className="text-sm font-medium">{property.rating.toFixed(1)}</span>
                      {property.reviewCount && (
                        <span className="text-xs text-gray-500 ml-1">({property.reviewCount})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                {property.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>
                )}

                {/* Property details */}
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>
                        {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>
                        {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {property.maxGuests && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {property.maxGuests} guest{property.maxGuests !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</span>
                    <span className="text-gray-600 text-sm ml-1">{getPriceSuffix(propertyType)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(property.createdAt)}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-hovmart-purple hover:bg-hovmart-light text-white"
                      onClick={(e) => {
                        e.preventDefault()
                        window.location.href = `/properties/${property.id}`
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
