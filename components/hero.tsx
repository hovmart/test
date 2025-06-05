"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Building, Home, Star, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const heroProperties = [
  {
    id: 1,
    title: "Luxury Ocean View Apartment",
    location: "Victoria Island, Lagos",
    image: "/luxury-ocean-view-apartment.png",
    price: "₦450,000",
    rating: 4.9,
    reviews: 124,
    featured: true,
  },
  {
    id: 2,
    title: "Elegant Villa with Pool",
    location: "Lekki Phase 1, Lagos",
    image: "/elegant-villa-lagos.png",
    price: "₦650,000",
    rating: 4.8,
    reviews: 86,
    featured: true,
  },
  {
    id: 3,
    title: "Modern Penthouse",
    location: "Ikoyi, Lagos",
    image: "/lagos-penthouse-view.png",
    price: "₦520,000",
    rating: 4.7,
    reviews: 92,
    featured: true,
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedGuests, setSelectedGuests] = useState(1)

  // Handle autoplay
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProperties.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  // Set loaded state after initial render
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Pause autoplay when user interacts with slider
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
    setAutoplay(false)

    // Resume autoplay after 10 seconds of inactivity
    const timeout = setTimeout(() => {
      setAutoplay(true)
    }, 10000)

    return () => clearTimeout(timeout)
  }

  const handleSearch = () => {
    // Navigate to properties page with search parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (selectedLocation) params.set("location", selectedLocation)
    if (selectedGuests > 1) params.set("guests", selectedGuests.toString())

    window.location.href = `/properties?${params.toString()}`
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-hovmart-purple/20 to-transparent"></div>

      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-hovmart-purple/10 to-amber-400/10 text-hovmart-purple text-sm font-medium mb-8">
                <span className="mr-2">✨</span>
                <span>Premium Real Estate Platform</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                <span className="block">Discover Your</span>
                <span className="block bg-gradient-to-r from-hovmart-purple to-amber-500 bg-clip-text text-transparent">
                  Dream Property
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                Explore exclusive properties across Nigeria. From luxury apartments to elegant villas, find your perfect
                home with Hovmart's curated collection.
              </p>

              {/* Enhanced Search Bar */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {/* Location */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Where to?"
                      className="w-full pl-10 pr-3 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    />
                  </div>

                  {/* Search Query */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Property type"
                      className="w-full pl-10 pr-3 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Guests */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-10 pr-3 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm appearance-none bg-transparent"
                      value={selectedGuests}
                      onChange={(e) => setSelectedGuests(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-hovmart-purple to-hovmart-light text-white rounded-xl py-3 px-6 font-medium hover:shadow-lg hover:shadow-hovmart-purple/25 transition-all duration-300"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-hovmart-purple to-hovmart-light text-white font-medium transition-all hover:shadow-lg hover:shadow-hovmart-purple/20 active:scale-[0.98] group"
                >
                  <span>Browse Properties</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-3 border-white overflow-hidden shadow-sm">
                      <Image
                        src={`/team/isaac-chindah.jpeg`}
                        alt={`User ${i}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">4.9/5</span> from over{" "}
                    <span className="font-semibold text-gray-900">2,500+</span> happy clients
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Property Slider */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Main image slider */}
                <div className="relative aspect-[4/3] md:aspect-[16/10] w-full">
                  <AnimatePresence mode="wait">
                    {heroProperties.map(
                      (property, index) =>
                        index === currentSlide && (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={property.image || "/placeholder.svg"}
                              alt={property.title}
                              fill
                              className="object-cover"
                              priority={index === 0}
                            />

                            {/* Enhanced gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                            {/* Property info */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-white mb-2">{property.title}</h3>
                                  <div className="flex items-center text-white/90 mb-4">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    <span>{property.location}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                      <Star className="w-4 h-4 text-amber-400 mr-2" />
                                      <span className="text-sm font-medium text-white">
                                        {property.rating} ({property.reviews})
                                      </span>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                      <span className="text-sm font-medium text-white">{property.price}/night</span>
                                    </div>
                                  </div>
                                </div>
                                {property.featured && (
                                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium px-4 py-2 rounded-full">
                                    Featured
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ),
                    )}
                  </AnimatePresence>
                </div>

                {/* Enhanced navigation dots */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
                  {heroProperties.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-white w-8 h-2 rounded-full"
                          : "bg-white/50 hover:bg-white/80 w-2 h-2 rounded-full"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Property thumbnails */}
              <div className="hidden md:flex gap-4 mt-6">
                {heroProperties.map((property, index) => (
                  <motion.button
                    key={property.id}
                    onClick={() => handleSlideChange(index)}
                    className={`relative flex-1 rounded-2xl overflow-hidden transition-all duration-300 ${
                      index === currentSlide
                        ? "ring-3 ring-hovmart-purple ring-offset-2 shadow-lg"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-sm font-medium text-white line-clamp-1">{property.title}</h4>
                        <p className="text-xs text-white/80 line-clamp-1">{property.location}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Floating decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-hovmart-purple/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-tr from-hovmart-purple/20 to-amber-400/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 md:mt-32"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Building,
                value: "500+",
                label: "Premium Properties",
                color: "from-hovmart-purple to-hovmart-light",
              },
              { icon: MapPin, value: "20+", label: "Cities Covered", color: "from-amber-400 to-orange-500" },
              { icon: Home, value: "1,200+", label: "Happy Customers", color: "from-green-400 to-emerald-500" },
              { icon: Star, value: "4.9", label: "Average Rating", color: "from-yellow-400 to-amber-500" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group"
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
