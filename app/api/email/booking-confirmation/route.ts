import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import ResendService, { type BookingConfirmationEmail } from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingData: BookingConfirmationEmail = await request.json()

    // Validate required fields
    const requiredFields = [
      "guestName",
      "guestEmail",
      "propertyTitle",
      "checkIn",
      "checkOut",
      "totalAmount",
      "bookingId",
      "ownerName",
    ]

    for (const field of requiredFields) {
      if (!bookingData[field as keyof BookingConfirmationEmail]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    await ResendService.sendBookingConfirmation(bookingData)

    return NextResponse.json({
      success: true,
      message: "Booking confirmation email sent successfully",
    })
  } catch (error) {
    console.error("Booking confirmation email API error:", error)
    return NextResponse.json(
      {
        error: "Failed to send booking confirmation email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
