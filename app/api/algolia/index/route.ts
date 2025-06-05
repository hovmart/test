import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import AlgoliaService, { type PropertySearchRecord } from "@/lib/algolia"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { properties } = await request.json()

    if (!properties || !Array.isArray(properties)) {
      return NextResponse.json({ error: "Properties array is required" }, { status: 400 })
    }

    // Validate property structure
    const validProperties: PropertySearchRecord[] = properties.filter((property) => {
      return (
        property.objectID &&
        property.title &&
        property.description &&
        property.price &&
        property.location &&
        property.category
      )
    })

    if (validProperties.length === 0) {
      return NextResponse.json({ error: "No valid properties to index" }, { status: 400 })
    }

    await AlgoliaService.indexProperties(validProperties)

    return NextResponse.json({
      success: true,
      message: `${validProperties.length} properties indexed successfully`,
      indexed: validProperties.length,
      skipped: properties.length - validProperties.length,
    })
  } catch (error) {
    console.error("Algolia indexing API error:", error)
    return NextResponse.json(
      {
        error: "Failed to index properties",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    await AlgoliaService.deleteProperty(propertyId)

    return NextResponse.json({
      success: true,
      message: "Property removed from search index",
    })
  } catch (error) {
    console.error("Algolia delete API error:", error)
    return NextResponse.json(
      {
        error: "Failed to remove property from index",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
