import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Mock property data
const mockProperty = {
  id: "1",
  title: "Luxury Ocean View Apartment",
  description:
    "Beautiful 3-bedroom apartment with stunning ocean views in the heart of Victoria Island. This modern apartment features floor-to-ceiling windows, premium finishes, and access to world-class amenities.",
  price: 2500000,
  location: "Victoria Island, Lagos",
  category: "buy",
  bedrooms: 3,
  bathrooms: 2,
  max_guests: 6,
  amenities: ["WiFi", "Pool", "Gym", "Parking", "Security", "Elevator", "Balcony"],
  images: ["/luxury-ocean-view-apartment.png", "/modern-ikoyi-apartment.png", "/lagos-penthouse-view.png"],
  featured: true,
  verified: true,
  rating: 4.8,
  views: 1250,
  status: "active",
  created_at: "2024-01-15T00:00:00Z",
  owner_id: "user_1",
  profiles: {
    full_name: "John Doe",
    avatar_url: "/man-portrait-3.png",
    phone: "+234 801 234 5678",
    email: "john@example.com",
    verified: true,
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // In a real app, you would fetch from database
    if (id === "1") {
      return NextResponse.json({ property: mockProperty })
    }

    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const updates = await request.json()

    // In a real app, you would update in database
    const updatedProperty = { ...mockProperty, ...updates, id }

    return NextResponse.json({ property: updatedProperty })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // In a real app, you would delete from database
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
