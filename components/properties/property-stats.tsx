"use client"

import { TrendingUp, Home, Clock, Building } from "lucide-react"
import { motion } from "framer-motion"

interface PropertyStatsProps {
  propertyType: "buy" | "rent" | "shortlet"
  totalProperties: number
  averagePrice?: number
  featuredCount?: number
}

export function PropertyStats({ propertyType, totalProperties, averagePrice, featuredCount }: PropertyStatsProps) {
  const getIcon = () => {
    switch (propertyType) {
      case "buy":
        return <Home className="h-6 w-6" />
      case "rent":
        return <Building className="h-6 w-6" />
      case "shortlet":
        return <Clock className="h-6 w-6" />
    }
  }

  const getTitle = () => {
    switch (propertyType) {
      case "buy":
        return "Properties for Sale"
      case "rent":
        return "Rental Properties"
      case "shortlet":
        return "Shortlet Properties"
    }
  }

  const getDescription = () => {
    switch (propertyType) {
      case "buy":
        return "Find your perfect home to purchase"
      case "rent":
        return "Discover long-term rental options"
      case "shortlet":
        return "Book short-term accommodations"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-hovmart-purple/10 to-hovmart-light/10 rounded-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-hovmart-purple/20 p-3 rounded-lg text-hovmart-purple">{getIcon()}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
            <p className="text-gray-600">{getDescription()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-hovmart-purple">{totalProperties}</div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
      </div>

      {averagePrice && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            Average Price: <span className="font-semibold ml-1">{formatPrice(averagePrice)}</span>
          </div>
          {featuredCount && featuredCount > 0 && (
            <div className="text-hovmart-purple font-medium">{featuredCount} Featured Properties</div>
          )}
        </div>
      )}
    </motion.div>
  )
}
