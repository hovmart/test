import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import ResendService from "@/lib/resend"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userEmail, userName } = await request.json()

    if (!userEmail || !userName) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    await ResendService.sendWelcomeEmail(userEmail, userName)

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
    })
  } catch (error) {
    console.error("Welcome email API error:", error)
    return NextResponse.json(
      {
        error: "Failed to send welcome email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
