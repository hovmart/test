import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import CloudinaryService from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const type = (formData.get("type") as string) || "general"
    const folder = (formData.get("folder") as string) || "hovmart"

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type))

    if (invalidFiles.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed",
        },
        { status: 400 },
      )
    }

    // Validate file sizes (10MB max per file)
    const maxSize = 10 * 1024 * 1024
    const oversizedFiles = files.filter((file) => file.size > maxSize)

    if (oversizedFiles.length > 0) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 10MB per file",
        },
        { status: 400 },
      )
    }

    // Convert files to buffers
    const fileBuffers = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer()
        return Buffer.from(bytes)
      }),
    )

    // Upload to Cloudinary
    const uploadResults = await CloudinaryService.uploadMultipleImages(fileBuffers, `${folder}/${type}/${userId}`)

    // Return upload results
    const uploadedFiles = uploadResults.map((result, index) => ({
      id: result.public_id,
      url: result.secure_url,
      thumbnailUrl: CloudinaryService.getThumbnailUrl(result.public_id),
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      originalName: files[index].name,
      uploadedAt: result.created_at,
    }))

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
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

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "Public ID required" }, { status: 400 })
    }

    // Delete from Cloudinary
    await CloudinaryService.deleteImage(publicId)

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("Delete API error:", error)
    return NextResponse.json(
      {
        error: "Delete failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
