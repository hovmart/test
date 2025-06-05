import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

// Mock data for development
const mockProperties = [
  {
    id: "1",
    title: "Luxury Ocean View Apartment",
    description: "Beautiful 3-bedroom apartment with stunning ocean views",
    price: 2500000,
    location: "Victoria Island, Lagos",
    category: "buy",
    bedrooms: 3,
    bathrooms: 2,
    max_guests: 6,
    amenities: ["WiFi", "Pool", "Gym", "Parking"],
    images: ["/luxury-ocean-view-apartment.png"],
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
  },
  {
    id: "2",
    title: "Modern Lekki Apartment",
    description: "Contemporary 2-bedroom apartment in prime Lekki location",
    price: 1800000,
    location: "Lekki Phase 1, Lagos",
    category: "rent",
    bedrooms: 2,
    bathrooms: 2,
    max_guests: 4,
    amenities: ["WiFi", "Security", "Parking"],
    images: ["/lekki-apartment.png"],
    featured: false,
    verified: true,
    rating: 4.5,
    views: 890,
    status: "active",
    created_at: "2024-01-10T00:00:00Z",
    owner_id: "user_2",
    profiles: {
      full_name: "Jane Smith",
      avatar_url: "/woman-portrait.png",
      phone: "+234 802 345 6789",
      email: "jane@example.com",
      verified: true,
    },
  },
  {
    id: "3",
    title: "Elegant Villa Lagos",
    description: "Spacious 4-bedroom villa with private garden",
    price: 5000000,
    location: "Ikoyi, Lagos",
    category: "buy",
    bedrooms: 4,
    bathrooms: 3,
    max_guests: 8,
    amenities: ["WiFi", "Pool", "Garden", "Security", "Parking"],
    images: ["/elegant-villa-lagos.png"],
    featured: true,
    verified: true,
    rating: 4.9,
    views: 2100,
    status: "active",
    created_at: "2024-01-05T00:00:00Z",
    owner_id: "user_3",
    profiles: {
      full_name: "Michael Johnson",
      avatar_url: "/thoughtful-man-portrait.png",
      phone: "+234 803 456 7890",
      email: "michael@example.com",
      verified: true,
    },
  },
  {
    id: "4",
    title: "Cozy Yaba Studio",
    description: "Perfect studio apartment for young professionals",
    price: 800000,
    location: "Yaba, Lagos",
    category: "shortlet",
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    amenities: ["WiFi", "Kitchen", "Parking"],
    images: ["/cozy-yaba-studio.png"],
    featured: false,
    verified: true,
    rating: 4.2,
    views: 650,
    status: "active",
    created_at: "2024-01-12T00:00:00Z",
    owner_id: "user_4",
    profiles: {
      full_name: "Sarah Wilson",
      avatar_url: "/woman-portrait-2.png",
      phone: "+234 804 567 8901",
      email: "sarah@example.com",
      verified: true,
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const sortBy = searchParams.get("sortBy") || "created_at"

    let filteredProperties = [...mockProperties]

    // Apply filters
    if (category && category !== "all") {
      filteredProperties = filteredProperties.filter((p) => p.category === category)
    }

    if (location) {
      filteredProperties = filteredProperties.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (search) {
      filteredProperties = filteredProperties.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        filteredProperties.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        filteredProperties.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredProperties.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filteredProperties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "featured":
        filteredProperties.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "views":
        filteredProperties.sort((a, b) => b.views - a.views)
        break
      default:
        filteredProperties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    // Apply limit
    filteredProperties = filteredProperties.slice(0, limit)

    return NextResponse.json({
      properties: filteredProperties,
      count: filteredProperties.length,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const propertyData = await request.json()

    // In a real app, you would save to database
    const newProperty = {
      id: Date.now().toString(),
      ...propertyData,
      owner_id: userId,
      status: "pending", // Properties need approval
      created_at: new Date().toISOString(),
      views: 0,
      rating: 0,
    }

    return NextResponse.json({ property: newProperty })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
