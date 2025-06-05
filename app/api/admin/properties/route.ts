import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user and check if they're an admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const propertyData = await request.json()

    // Insert property into database
    const { data: property, error } = await supabase
      .from("properties")
      .insert({
        title: propertyData.title,
        description: propertyData.description,
        location: propertyData.location,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        country: propertyData.country || "Nigeria",
        price: propertyData.price,
        price_type: propertyData.priceType,
        category: propertyData.priceType,
        property_type: propertyData.propertyType,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        square_feet: propertyData.squareFeet,
        land_size: propertyData.landSize,
        land_unit: propertyData.landUnit,
        max_guests: propertyData.maxGuests,
        images: propertyData.images || [],
        amenities: propertyData.amenities || [],
        features: propertyData.features || [],
        owner_id: user.id,
        status: propertyData.featured ? "active" : "pending",
        featured: propertyData.featured || false,
        verified: propertyData.verified || true,
        available: true,
        rating: 0,
        review_count: 0,
        view_count: 0,
        favorite_count: 0,
      })
      .select("*")
      .single()

    if (error) {
      console.error("Property creation error:", error)
      return NextResponse.json({ error: "Failed to create property", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ property, message: "Property created successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Get the current user and check if they're an admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("properties")
      .select(`
        *,
        profiles:owner_id (
          full_name,
          email,
          avatar_url,
          phone
        )
      `)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data: properties, error } = await query

    if (error) {
      console.error("Properties fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
    }

    return NextResponse.json({ properties: properties || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
