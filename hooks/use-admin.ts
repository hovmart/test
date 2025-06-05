"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./use-auth"
import { toast } from "./use-toast"

interface PropertyData {
  title: string
  description: string
  location: string
  address?: string
  city: string
  state: string
  country?: string
  price: number
  priceType: string
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  landSize?: number
  landUnit?: string
  maxGuests?: number
  images?: string[]
  amenities?: string[]
  features?: string[]
  featured?: boolean
  verified?: boolean
}

export function useAdminProperties(filters: { status?: string; limit?: number; offset?: number } = {}) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["admin-properties", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/admin/properties?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch properties")
      }

      const data = await response.json()
      return data.properties || []
    },
    enabled: !!user && user.user_metadata?.role === "admin",
  })
}

export function useCreateAdminProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (propertyData: PropertyData) => {
      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create property")
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      toast({
        title: "Success",
        description: data.message || "Property created successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useUpdateAdminProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PropertyData> }) => {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update property")
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      toast({
        title: "Success",
        description: data.message || "Property updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useDeleteAdminProperty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete property")
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      toast({
        title: "Success",
        description: data.message || "Property deleted successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useUploadPropertyImages() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to upload images")
      }

      return response.json()
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
