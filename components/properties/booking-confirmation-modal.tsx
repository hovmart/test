"use client"

import { useState, useEffect } from "react"
import { Check, Calendar, Mail, Phone, MapPin, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  bookingDetails: {
    propertyTitle: string
    propertyType: "buy" | "rent" | "shortlet"
    contactInfo: {
      name: string
      email: string
      phone: string
      message?: string
    }
    checkIn?: string
    checkOut?: string
    guests?: number
    totalPrice?: number
  }
}

export function BookingConfirmationModal({ isOpen, onClose, bookingDetails }: BookingConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getActionText = () => {
    switch (bookingDetails.propertyType) {
      case "buy":
        return "Inspection Scheduled"
      case "rent":
        return "Application Submitted"
      case "shortlet":
        return "Reservation Confirmed"
      default:
        return "Booking Confirmed"
    }
  }

  const getNextSteps = () => {
    switch (bookingDetails.propertyType) {
      case "buy":
        return [
          "We'll contact you within 24 hours to confirm your inspection appointment",
          "Prepare any questions you'd like to ask during the viewing",
          "Bring a valid ID for the property inspection",
        ]
      case "rent":
        return [
          "We'll review your application within 48 hours",
          "Prepare required documents (ID, proof of income, references)",
          "We'll contact you with the next steps in the rental process",
        ]
      case "shortlet":
        return [
          "Check your email for detailed booking confirmation",
          "You'll receive check-in instructions 24 hours before arrival",
          "Contact us if you need any special arrangements",
        ]
      default:
        return ["We'll be in touch soon with more details"]
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{getActionText()}</h2>
                <p className="text-gray-600">
                  Booking reference: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Property Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{bookingDetails.propertyTitle}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {bookingDetails.checkIn && bookingDetails.checkOut && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(bookingDetails.checkIn).toLocaleDateString()} -{" "}
                    {new Date(bookingDetails.checkOut).toLocaleDateString()}
                  </span>
                </div>
              )}
              {bookingDetails.guests && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {bookingDetails.guests} guest{bookingDetails.guests !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {bookingDetails.totalPrice && (
                <div className="flex items-center font-semibold text-gray-900">
                  <span>Total: {formatPrice(bookingDetails.totalPrice)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{bookingDetails.contactInfo.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{bookingDetails.contactInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">What happens next?</h4>
            <div className="space-y-3">
              {getNextSteps().map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-hovmart-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-600 flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Response Time */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center text-blue-800">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-semibold">
                Expected response time:{" "}
                {bookingDetails.propertyType === "buy"
                  ? "24 hours"
                  : bookingDetails.propertyType === "rent"
                    ? "48 hours"
                    : "Immediate"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleClose} className="w-full bg-hovmart-purple hover:bg-hovmart-light text-white">
              Continue Browsing
            </Button>
            <Button variant="outline" className="w-full">
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
