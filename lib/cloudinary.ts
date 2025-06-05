import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

export class CloudinaryService {
  static async uploadImage(
    file: Buffer | string,
    options: {
      folder?: string
      public_id?: string
      transformation?: any
      resource_type?: "image" | "video" | "raw" | "auto"
    } = {},
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: options.folder || "hovmart",
        public_id: options.public_id,
        transformation: options.transformation,
        resource_type: options.resource_type || "auto",
        quality: "auto",
        fetch_format: "auto",
      })

      return result as CloudinaryUploadResult
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      throw new Error("Failed to upload image to Cloudinary")
    }
  }

  static async uploadMultipleImages(
    files: (Buffer | string)[],
    folder = "hovmart/properties",
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = files.map((file, index) =>
        this.uploadImage(file, {
          folder,
          public_id: `${Date.now()}_${index}`,
        }),
      )

      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error("Multiple upload error:", error)
      throw new Error("Failed to upload multiple images")
    }
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error("Cloudinary delete error:", error)
      throw new Error("Failed to delete image from Cloudinary")
    }
  }

  static getOptimizedUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      crop?: string
      quality?: string | number
      format?: string
    } = {},
  ): string {
    return cloudinary.url(publicId, {
      width: options.width,
      height: options.height,
      crop: options.crop || "fill",
      quality: options.quality || "auto",
      format: options.format || "auto",
      fetch_format: "auto",
    })
  }

  static getThumbnailUrl(publicId: string, size = 300): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: "fill",
      quality: 80,
    })
  }
}

export default CloudinaryService
