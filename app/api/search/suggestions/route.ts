import { type NextRequest, NextResponse } from "next/server"
import AlgoliaService from "@/lib/algolia"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: [],
      })
    }

    const suggestions = await AlgoliaService.getSearchSuggestions(query, limit)

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error) {
    console.error("Suggestions API error:", error)
    return NextResponse.json(
      {
        error: "Failed to get suggestions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
