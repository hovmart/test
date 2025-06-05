import { type NextRequest, NextResponse } from "next/server"
import AlgoliaService, { type SearchFilters } from "@/lib/algolia"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "0")
    const hitsPerPage = Number.parseInt(searchParams.get("limit") || "20")
    const sortBy = searchParams.get("sortBy") || undefined

    // Build filters from search params
    const filters: SearchFilters = {}

    if (searchParams.get("category")) {
      filters.category = searchParams.get("category") as any
    }

    if (searchParams.get("location")) {
      filters.location = searchParams.get("location")!
    }

    if (searchParams.get("priceMin")) {
      filters.priceMin = Number.parseInt(searchParams.get("priceMin")!)
    }

    if (searchParams.get("priceMax")) {
      filters.priceMax = Number.parseInt(searchParams.get("priceMax")!)
    }

    if (searchParams.get("bedrooms")) {
      filters.bedrooms = Number.parseInt(searchParams.get("bedrooms")!)
    }

    if (searchParams.get("bathrooms")) {
      filters.bathrooms = Number.parseInt(searchParams.get("bathrooms")!)
    }

    if (searchParams.get("property_type")) {
      filters.property_type = searchParams.get("property_type")!
    }

    if (searchParams.get("verified")) {
      filters.verified = searchParams.get("verified") === "true"
    }

    if (searchParams.get("featured")) {
      filters.featured = searchParams.get("featured") === "true"
    }

    if (searchParams.get("amenities")) {
      filters.amenities = searchParams.get("amenities")!.split(",")
    }

    // Perform search
    const results = await AlgoliaService.searchProperties(query, filters, {
      page,
      hitsPerPage,
      sortBy,
    })

    return NextResponse.json({
      success: true,
      ...results,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      {
        error: "Search failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
