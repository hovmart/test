"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ProfileImageUploadProps {
  currentImage?: string
  onImageUpdate: (imageUrl: string) => void
  userName?: string
}

export function ProfileImageUpload({ currentImage, onImageUpdate, userName = "User" }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or WebP image",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "avatar")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      // Update the profile with new image URL
      onImageUpdate(data.url)
      setPreviewImage(null)

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "Failed to update your profile picture. Please try again.",
        variant: "destructive",
      })
      setPreviewImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const cancelPreview = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="relative group">
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="relative">
        <Avatar className="w-24 h-24 border-4 border-white/20 shadow-xl">
          <AvatarImage src={previewImage || currentImage || ""} alt={userName} className="object-cover" />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-hovmart-purple to-hovmart-dark text-white font-bold">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay */}
        <AnimatePresence>
          {!isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              onClick={triggerFileSelect}
            >
              <Camera className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center"
            >
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action buttons */}
      <div className="absolute -bottom-2 -right-2 flex gap-1">
        {previewImage && !isUploading && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 rounded-full p-0 bg-red-500 border-red-500 hover:bg-red-600 text-white"
              onClick={cancelPreview}
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        )}

        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 rounded-full p-0 bg-white border-2 border-hovmart-purple/20 hover:border-hovmart-purple/40 hover:bg-hovmart-purple/5 shadow-lg"
          disabled={isUploading}
          onClick={triggerFileSelect}
        >
          {isUploading ? (
            <div className="h-3 w-3 border border-hovmart-purple border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="h-3 w-3 text-hovmart-purple" />
          )}
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
