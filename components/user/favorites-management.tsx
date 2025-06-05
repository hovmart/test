"use client"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MapPin, Star, Share2, Eye, Trash2, Search, Grid3X3, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// Mock favorites data
const mockFavorites = [
  {
    id: "1",
    title: "Luxury Ocean View Apartment",
    location: "Victoria Island, Lagos",
    price: "₦2,500,000",
    type: "rent",
    rating: 4.8,
    reviews: 24,
    image: "/luxury-ocean-view-apartment.png",
    savedDate: "2024-01-15",
    bedrooms: 3,
    bathrooms: 2,
    area: "120 sqm",
  },
  {
    id: "2",
    title: "Modern Ikoyi Apartment",
    location: "Ikoyi, Lagos",
    price: "₦1,800,000",
    type: "rent",
    rating: 4.6,
    reviews: 18,
    image: "/modern-ikoyi-apartment.png",
    savedDate: "2024-01-12",
    bedrooms: 2,
    bathrooms: 2,
    area: "95 sqm",
  },
  {
    id: "3",
    title: "Elegant Villa Lagos",
    location: "Lekki, Lagos",
    price: "₦85,000,000",
    type: "buy",
    rating: 4.9,
    reviews: 31,
    image: "/elegant-villa-lagos.png",
    savedDate: "2024-01-10",
    bedrooms: 5,
    bathrooms: 4,
    area: "350 sqm",
  },
  {
    id: "4",
    title: "Cozy Yaba Studio",
    location: "Yaba, Lagos",
    price: "₦180,000",
    type: "shortlet",
    rating: 4.4,
    reviews: 12,
    image: "/cozy-yaba-studio.png",
    savedDate: "2024-01-08",
    bedrooms: 1,
    bathrooms: 1,
    area: "45 sqm",
  },
  {
    id: "5",
    title: "Lagos Penthouse View",
    location: "Victoria Island, Lagos",
    price: "₦4,200,000",
    type: "rent",
    rating: 4.7,
    reviews: 19,
    image: "/lagos-penthouse-view.png",
    savedDate: "2024-01-05",
    bedrooms: 4,
    bathrooms: 3,
    area: "200 sqm",
  },
  {
    id: "6",
    title: "Ikeja Serviced Apartment",
    location: "Ikeja, Lagos",
    price: "₦320,000",
    type: "shortlet",
    rating: 4.5,
    reviews: 15,
    image: "/ikeja-serviced-apartment.png",
    savedDate: "2024-01-03",
    bedrooms: 2,
    bathrooms: 1,
    area: "80 sqm",
  },
]

export function FavoritesManagement() {
  const { user, isLoaded } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState(mockFavorites)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hovmart-purple"></div>
      </div>
    )
  }

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== id))
  }

  const handleShare = (property: any) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: `/properties/${property.id}`,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/properties/${property.id}`)
    }
  }

  const filteredFavorites = favorites
    .filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || property.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime()
        case "oldest":
          return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime()
        case "price-high":
          return Number.parseInt(b.price.replace(/[₦,]/g, "")) - Number.parseInt(a.price.replace(/[₦,]/g, ""))
        case "price-low":
          return Number.parseInt(a.price.replace(/[₦,]/g, "")) - Number.parseInt(b.price.replace(/[₦,]/g, ""))
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-1">
            {favorites.length} saved {favorites.length === 1 ? "property" : "properties"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-hovmart-purple hover:bg-hovmart-dark" : ""}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-hovmart-purple hover:bg-hovmart-dark" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search favorites by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hovmart-purple"
              >
                <option value="all">All Types</option>
                <option value="buy">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="shortlet">Shortlet</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hovmart-purple"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Grid/List */}
      {filteredFavorites.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || typeFilter !== "all" ? "No favorites found" : "No favorites yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start exploring properties and save your favorites"}
            </p>
            {!searchTerm && typeFilter === "all" && (
              <Link href="/properties">
                <Button className="bg-hovmart-purple hover:bg-hovmart-dark">Browse Properties</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="relative">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={`${
                            property.type === "buy"
                              ? "bg-blue-100 text-blue-800"
                              : property.type === "rent"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {property.type === "buy" ? "For Sale" : property.type === "rent" ? "For Rent" : "Shortlet"}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white p-2"
                          onClick={() => handleShare(property)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-red-50 p-2 text-red-600 hover:text-red-700"
                          onClick={() => handleRemoveFavorite(property.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-hovmart-purple">{property.price}</span>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          {property.rating} ({property.reviews})
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                        <span>{property.area}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/properties/${property.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button size="sm" className="flex-1 bg-hovmart-purple hover:bg-hovmart-dark">
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFavorites.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  layout
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <Image
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            width={250}
                            height={180}
                            className="rounded-lg object-cover w-full lg:w-64 h-44"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                              <p className="text-gray-600 flex items-center mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                {property.location}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{property.bedrooms} beds</span>
                                <span>{property.bathrooms} baths</span>
                                <span>{property.area}</span>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                  {property.rating} ({property.reviews} reviews)
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={`mb-2 ${
                                  property.type === "buy"
                                    ? "bg-blue-100 text-blue-800"
                                    : property.type === "rent"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {property.type === "buy"
                                  ? "For Sale"
                                  : property.type === "rent"
                                    ? "For Rent"
                                    : "Shortlet"}
                              </Badge>
                              <p className="text-2xl font-bold text-hovmart-purple">{property.price}</p>
                              <p className="text-sm text-gray-500">
                                Saved {new Date(property.savedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <Link href={`/properties/${property.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                            <Button size="sm" className="bg-hovmart-purple hover:bg-hovmart-dark">
                              Contact Owner
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleShare(property)}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveFavorite(property.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
