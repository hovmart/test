"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  Shield,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
  Waves,
  TreePine,
  Dumbbell,
  Camera,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import type { Property } from "@/data/properties"
import { EnhancedPropertyBooking } from "./enhanced-property-booking"

interface PropertyDetailViewProps {
  property: Property
}

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  Kitchen: Utensils,
  TV: Tv,
  "Air Conditioning": Wind,
  Pool: Waves,
  Garden: TreePine,
  Gym: Dumbbell,
  Security: Shield,
}

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Gallery */}
      <div className="relative h-[60vh] bg-black">
        <Image
          src={property.images[currentImageIndex] || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Arrows */}
        {property.images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {property.images.length}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                  <div className="text-sm text-gray-500">
                    {property.type === "shortlet" ? "per night" : property.type === "rent" ? "per year" : "total price"}
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{property.area} sqft</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{property.rating}</span>
                </div>
              </div>

              {/* Property Type Badge */}
              <div>
                <Badge variant="secondary" className="capitalize">
                  {property.type}
                </Badge>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {property.description ||
                        `Beautiful ${property.type} property located in ${property.location}. This stunning ${property.bedrooms}-bedroom, ${property.bathrooms}-bathroom property offers ${property.area} square feet of living space with modern amenities and excellent location.`}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Property Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-blue-600" />
                        <span>{property.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-blue-600" />
                        <span>{property.bathrooms} Bathrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4 text-blue-600" />
                        <span>{property.area} sqft</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span>Parking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-blue-600" />
                        <span>WiFi</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Available Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities?.map((amenity, index) => {
                        const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Shield
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4 text-blue-600" />
                            <span>{amenity}</span>
                          </div>
                        )
                      }) || (
                        <>
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4 text-blue-600" />
                            <span>WiFi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-blue-600" />
                            <span>Parking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Utensils className="h-4 w-4 text-blue-600" />
                            <span>Kitchen</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tv className="h-4 w-4 text-blue-600" />
                            <span>TV</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-blue-600" />
                            <span>Air Conditioning</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span>Security</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Location & Neighborhood</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{property.location}</span>
                      </div>
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Interactive map would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Guest Reviews</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{property.rating}</span>
                        <span className="text-gray-500">(24 reviews)</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            JD
                          </div>
                          <div>
                            <p className="font-semibold">John Doe</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">
                          Amazing property with great amenities. The location is perfect and the host was very
                          responsive.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <EnhancedPropertyBooking
                price={property.price}
                rating={property.rating}
                reviewCount={24}
                maxGuests={property.maxGuests || 4}
                propertyType={property.type as "buy" | "rent" | "shortlet"}
                propertyTitle={property.title}
                propertyId={property.id}
              />

              {/* Contact Information */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Host</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Host
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
