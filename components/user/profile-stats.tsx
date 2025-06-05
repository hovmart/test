"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Shield, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function ProfileStats() {
  const { user } = useAuth()

  if (!user) return null

  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  const stats = [
    {
      label: "Member Since",
      value: memberSince,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      label: "Account Type",
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      icon: Shield,
      color: "text-blue-600",
    },
    {
      label: "Verification Status",
      value: user.verified ? "Verified" : "Pending",
      icon: user.verified ? Star : Shield,
      color: user.verified ? "text-green-600" : "text-yellow-600",
    },
    {
      label: "Location",
      value: user.address || "Not provided",
      icon: MapPin,
      color: "text-gray-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{stat.label}</p>
                <p className="text-sm text-gray-500 truncate">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
