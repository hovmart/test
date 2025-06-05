"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  Star,
  MapPin,
  Download,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

// Mock data - replace with API calls
const dashboardStats = {
  totalRevenue: 140000000,
  revenueGrowth: 12,
  totalBookings: 473,
  bookingsGrowth: 8,
  totalProperties: 320,
  propertiesGrowth: 5,
  totalUsers: 1294,
  usersGrowth: -3,
  activeListings: 298,
  pendingApprovals: 12,
  totalViews: 45230,
  conversionRate: 3.2,
}

const recentActivities = [
  {
    id: 1,
    type: "booking",
    title: "New booking confirmed",
    description: "John Doe booked Luxury Ocean View Apartment",
    time: "2 minutes ago",
    amount: "₦250,000",
    status: "success",
  },
  {
    id: 2,
    type: "property",
    title: "Property listed",
    description: "Modern Villa in Lekki was approved and listed",
    time: "15 minutes ago",
    status: "info",
  },
  {
    id: 3,
    type: "user",
    title: "New user registered",
    description: "Jane Smith created an account",
    time: "1 hour ago",
    status: "info",
  },
  {
    id: 4,
    type: "payment",
    title: "Payment received",
    description: "₦450,000 payment for booking #BKG-1234",
    time: "2 hours ago",
    amount: "₦450,000",
    status: "success",
  },
]

const topProperties = [
  {
    id: "1",
    title: "Luxury Ocean View Apartment",
    location: "Victoria Island, Lagos",
    price: "₦250,000/month",
    bookings: 24,
    revenue: "₦6,000,000",
    rating: 4.9,
    image: "/luxury-ocean-view-apartment.png",
    growth: 15,
  },
  {
    id: "2",
    title: "Elegant Villa Lagos",
    location: "Ikoyi, Lagos",
    price: "₦450,000/month",
    bookings: 18,
    revenue: "₦8,100,000",
    rating: 4.8,
    image: "/elegant-villa-lagos.png",
    growth: 8,
  },
  {
    id: "3",
    title: "Modern Lekki Apartment",
    location: "Lekki, Lagos",
    price: "₦180,000/month",
    bookings: 32,
    revenue: "₦5,760,000",
    rating: 4.7,
    image: "/lekki-apartment.png",
    growth: 22,
  },
]

export default function EnhancedDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting data...")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your properties.</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">This year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: `₦${(dashboardStats.totalRevenue / 1000000).toFixed(1)}M`,
            change: dashboardStats.revenueGrowth,
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-green-50",
            textColor: "text-green-700",
          },
          {
            title: "Total Bookings",
            value: dashboardStats.totalBookings.toLocaleString(),
            change: dashboardStats.bookingsGrowth,
            icon: Calendar,
            color: "from-blue-500 to-cyan-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
          },
          {
            title: "Active Properties",
            value: dashboardStats.activeListings.toLocaleString(),
            change: dashboardStats.propertiesGrowth,
            icon: Building2,
            color: "from-purple-500 to-violet-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
          },
          {
            title: "Total Users",
            value: dashboardStats.totalUsers.toLocaleString(),
            change: dashboardStats.usersGrowth,
            icon: Users,
            color: "from-orange-500 to-red-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-700",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${stat.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">{stat.title}</p>
                      <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center text-sm">
                    {stat.change >= 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={stat.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              Property Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{dashboardStats.totalViews.toLocaleString()}</div>
            <p className="text-sm text-gray-600 mt-1">Total views this month</p>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{dashboardStats.conversionRate}%</div>
            <p className="text-sm text-gray-600 mt-1">Views to bookings</p>
            <Progress value={dashboardStats.conversionRate * 10} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-orange-600" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{dashboardStats.pendingApprovals}</div>
            <p className="text-sm text-gray-600 mt-1">Properties awaiting review</p>
            <Button size="sm" className="mt-3 w-full">
              Review Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your platform</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-100"
                            : activity.status === "info"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                        }`}
                      >
                        {activity.type === "booking" && <Calendar className="h-4 w-4 text-green-600" />}
                        {activity.type === "property" && <Building2 className="h-4 w-4 text-blue-600" />}
                        {activity.type === "user" && <Users className="h-4 w-4 text-purple-600" />}
                        {activity.type === "payment" && <CreditCard className="h-4 w-4 text-green-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">{activity.time}</span>
                            {activity.amount && <p className="text-sm font-medium text-green-600">{activity.amount}</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Properties */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Top Performing Properties</CardTitle>
                <CardDescription>Highest revenue generators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{property.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium text-green-600">{property.revenue}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs">{property.rating}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
              <CardDescription>Manage your property listings and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Property management interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, agents, and administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">User management interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed insights and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Advanced analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
