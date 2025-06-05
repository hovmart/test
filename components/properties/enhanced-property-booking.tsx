"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, Users, Phone, Mail, User, Star, Shield, Check, Clock, Home, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface EnhancedPropertyBookingProps {
  price: number
  rating: number
  reviewCount: number
  maxGuests: number
  propertyType: "buy" | "rent" | "shortlet"
  propertyTitle: string
  propertyId: string
}

export function EnhancedPropertyBooking({
  price,
  rating,
  reviewCount,
  maxGuests,
  propertyType,
  propertyTitle,
  propertyId,
}: EnhancedPropertyBookingProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    preferredTime: "",
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPriceLabel = () => {
    switch (propertyType) {
      case "shortlet":
        return "per night"
      case "rent":
        return "per year"
      case "buy":
        return ""
      default:
        return "per month"
    }
  }

  const getActionLabel = () => {
    switch (propertyType) {
      case "buy":
        return "Schedule Inspection"
      case "rent":
        return "Apply Now"
      case "shortlet":
        return "Reserve Now"
      default:
        return "Book Now"
    }
  }

  const getServiceFee = () => {
    switch (propertyType) {
      case "buy":
        return price * 0.025 // 2.5% for property purchase
      case "rent":
        return price * 0.1 // 10% for annual rent
      case "shortlet":
        return price * 0.15 // 15% for nightly rate
      default:
        return 0
    }
  }

  const getTotalPrice = () => {
    const serviceFee = getServiceFee()
    return price + serviceFee
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)

    toast({
      title: "Booking Submitted Successfully!",
      description: `Your ${propertyType} request for ${propertyTitle} has been submitted.`,
    })

    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        preferredTime: "",
      })
    }, 3000)
  }

  const isFormValid = () => {
    return formData.name && formData.email && formData.phone
  }

  if (showSuccess) {
    return (
      <Card className="bg-white rounded-2xl shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Your {propertyType} request has been submitted successfully. We'll get back to you within 24 hours.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Reference:</strong> HM-{propertyId.toUpperCase()}-{Date.now().toString().slice(-6)}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {propertyType === "buy" && "Our agent will contact you to schedule a property inspection."}
              {propertyType === "rent" && "We'll review your application and contact you with next steps."}
              {propertyType === "shortlet" && "Your reservation is being processed. Confirmation coming soon!"}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
              <span className="text-gray-600 text-sm">{getPriceLabel()}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-sm">{rating}</span>
              </div>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600 text-sm">{reviewCount} reviews</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-hovmart-purple/10 text-hovmart-purple border-hovmart-purple/20">
            {propertyType === "buy" && <Home className="h-3 w-3 mr-1" />}
            {propertyType === "rent" && <Building className="h-3 w-3 mr-1" />}
            {propertyType === "shortlet" && <Clock className="h-3 w-3 mr-1" />}
            {propertyType?.charAt(0).toUpperCase() + propertyType?.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number *
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>
          </div>

          {/* Property-specific fields */}
          {propertyType === "shortlet" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
                  Check-in
                </Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
                  Check-out
                </Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {(propertyType === "shortlet" || propertyType === "rent") && (
            <div>
              <Label htmlFor="guests" className="text-sm font-medium text-gray-700">
                {propertyType === "shortlet" ? "Guests" : "Occupants"}
              </Label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hovmart-purple focus:border-transparent"
                >
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "person" : "people"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {propertyType === "buy" && (
            <div>
              <Label htmlFor="preferredTime" className="text-sm font-medium text-gray-700">
                Preferred Inspection Time
              </Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hovmart-purple focus:border-transparent"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 7PM)</option>
                  <option value="weekend">Weekend</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Additional Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="mt-1"
              placeholder={
                propertyType === "buy"
                  ? "Any specific requirements or questions about the property?"
                  : propertyType === "rent"
                    ? "Tell us about yourself and why you're interested in this property"
                    : "Any special requests or questions about your stay?"
              }
              rows={3}
            />
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                {propertyType === "buy" ? "Property Price" : propertyType === "rent" ? "Annual Rent" : "Nightly Rate"}
              </span>
              <span>{formatPrice(price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee</span>
              <span>{formatPrice(getServiceFee())}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="w-full bg-hovmart-purple hover:bg-hovmart-light text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              getActionLabel()
            )}
          </Button>

          {propertyType === "rent" && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-hovmart-purple text-hovmart-purple hover:bg-hovmart-purple hover:text-white"
            >
              Schedule Viewing
            </Button>
          )}
        </form>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Shield className="h-3 w-3" />
            <span>Secure booking</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Check className="h-3 w-3" />
            <span>Instant confirmation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
