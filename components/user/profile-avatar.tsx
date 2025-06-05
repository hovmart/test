"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface ProfileAvatarProps {
  size?: "sm" | "md" | "lg" | "xl"
  editable?: boolean
}

export function ProfileAvatar({ size = "md", editable = false }: ProfileAvatarProps) {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create a temporary URL for immediate preview
      const tempUrl = URL.createObjectURL(file)

      // Update profile with temporary URL (in a real app, you'd upload to Supabase Storage)
      await updateProfile({ avatar_url: tempUrl })

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to update your profile picture",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (!user) return null

  return (
    <div className="relative">
      <Avatar
        className={`${sizeClasses[size]} ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-300`}
      >
        <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium">
          {getInitials(user.full_name || user.email)}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <div className="absolute -bottom-1 -right-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 rounded-full p-0 bg-white border-2 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-50"
            disabled={isUploading}
            asChild
          >
            <label htmlFor="avatar-upload" className="cursor-pointer">
              {isUploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
              ) : (
                <Camera className="h-4 w-4 text-purple-600" />
              )}
            </label>
          </Button>
          <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
        </div>
      )}
    </div>
  )
}
