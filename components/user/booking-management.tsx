"use client"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

// Mock booking data
const mockBookings = [
  {
    id: "1",
    property: {
      title: "Luxury Ocean View Apartment",
      location: "Victoria Island, Lagos",
      image: "/luxury-ocean-view-apartment.png",
    },
    guest: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+234 801 234 5678",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2024-01-15",
    checkOut: "2024-01-20",
    nights: 5,
    guests: 2,
    amount: 450000,
    status: "confirmed",
    bookingDate: "2024-01-10",
    specialRequests: "Late check-in requested",
    paymentStatus: "paid",
  },
  {
    id: "2",
    property: {
      title: "Modern Ikoyi Apartment",
      location: "Ikoyi, Lagos",
      image: "/modern-ikoyi-apartment.png",
    },
    guest: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+234 802 345 6789",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2024-01-22",
    checkOut: "2024-01-25",
    nights: 3,
    guests: 1,
    amount: 320000,
    status: "pending",
    bookingDate: "2024-01-18",
    specialRequests: "Airport pickup needed",
    paymentStatus: "pending",
  },
  {
    id: "3",
    property: {
      title: "Elegant Villa Lagos",
      location: "Lekki, Lagos",
      image: "/elegant-villa-lagos.png",
    },
    guest: {
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "+234 803 456 7890",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2024-01-10",
    checkOut: "2024-01-12",
    nights: 2,
    guests: 4,
    amount: 680000,
    status: "completed",
    bookingDate: "2024-01-05",
    specialRequests: "None",
    paymentStatus: "paid",
    rating: 5,
    review: "Amazing property with excellent service!",
  },
  {
    id: "4",
    property: {
      title: "Cozy Yaba Studio",
      location: "Yaba, Lagos",
      image: "/cozy-yaba-studio.png",
    },
    guest: {
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+234 804 567 8901",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    checkIn: "2024-01-08",
    checkOut: "2024-01-10",
    nights: 2,
    guests: 1,
    amount: 180000,
    status: "cancelled",
    bookingDate: "2024-01-03",
    specialRequests: "Early check-in",
    paymentStatus: "refunded",
  },
]

export function BookingManagement() {
  const { user, isLoaded } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hovmart-purple"></div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesTab = activeTab === "all" || booking.status === activeTab
    return matchesSearch && matchesStatus && matchesTab
  })

  const getTabCount = (status: string) => {
    if (status === "all") return mockBookings.length
    return mockBookings.filter((booking) => booking.status === status).length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">Manage all your property bookings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-hovmart-purple hover:bg-hovmart-dark">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings by property or guest name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hovmart-purple"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg rounded-xl p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-hovmart-purple data-[state=active]:text-white">
            All ({getTabCount("all")})
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="data-[state=active]:bg-hovmart-purple data-[state=active]:text-white"
          >
            Confirmed ({getTabCount("confirmed")})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-hovmart-purple data-[state=active]:text-white">
            Pending ({getTabCount("pending")})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-hovmart-purple data-[state=active]:text-white"
          >
            Completed ({getTabCount("completed")})
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="data-[state=active]:bg-hovmart-purple data-[state=active]:text-white"
          >
            Cancelled ({getTabCount("cancelled")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {filteredBookings.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You don't have any bookings yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Property Image */}
                        <div className="flex-shrink-0">
                          <Image
                            src={booking.property.image || "/placeholder.svg"}
                            alt={booking.property.title}
                            width={200}
                            height={150}
                            className="rounded-lg object-cover w-full lg:w-48 h-36"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.property.title}</h3>
                              <p className="text-gray-600 flex items-center mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {booking.property.location}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {booking.checkIn} - {booking.checkOut}
                                </span>
                                <span>{booking.nights} nights</span>
                                <span>{booking.guests} guests</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  {getStatusIcon(booking.status)}
                                  <span className="ml-1 capitalize">{booking.status}</span>
                                </Badge>
                              </div>
                              <p className="text-2xl font-bold text-hovmart-purple">
                                ₦{booking.amount.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">Payment: {booking.paymentStatus}</p>
                            </div>
                          </div>

                          {/* Guest Information */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Guest Information</h4>
                            <div className="flex items-center gap-4">
                              <Image
                                src={booking.guest.avatar || "/placeholder.svg"}
                                alt={booking.guest.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{booking.guest.name}</p>
                                <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {booking.guest.email}
                                  </span>
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {booking.guest.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {booking.specialRequests !== "None" && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <strong>Special Requests:</strong> {booking.specialRequests}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Review (for completed bookings) */}
                          {booking.status === "completed" && booking.review && (
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-semibold">{booking.rating}/5</span>
                              </div>
                              <p className="text-gray-700 italic">"{booking.review}"</p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Contact Guest
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download Receipt
                            </Button>
                            {booking.status === "pending" && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirm
                                </Button>
                                <Button variant="destructive" size="sm">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Decline
                                </Button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <Button variant="outline" size="sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                Modify Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
