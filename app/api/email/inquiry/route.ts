import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import ResendService, { type PropertyInquiryEmail } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inquiryData: PropertyInquiryEmail = await request.json()

    // Validate required fields
    const requiredFields = [
      "propertyTitle",
      "propertyUrl",
      "inquirerName",
      "inquirerEmail",
      "message",
      "ownerName",
      "ownerEmail",
    ]

    for (const field of requiredFields) {
      if (!inquiryData[field as keyof PropertyInquiryEmail]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    await ResendService.sendPropertyInquiry(inquiryData)

    return NextResponse.json({
      success: true,
      message: "Inquiry email sent successfully",
    })
  } catch (error) {
    console.error("Inquiry email API error:", error)
    return NextResponse.json(
      {
        error: "Failed to send inquiry email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
