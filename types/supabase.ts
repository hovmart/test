export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = "user" | "agent" | "admin"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: string | null
          date_of_birth: string | null
          bio: string | null
          role: UserRole
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          bio?: string | null
          role?: UserRole
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          bio?: string | null
          role?: UserRole
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string | null
          location: string
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          price: number
          price_type: "buy" | "rent" | "shortlet"
          category: "buy" | "rent" | "shortlet"
          property_type: string | null
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          land_size: number | null
          land_unit: string | null
          max_guests: number | null
          images: string[]
          amenities: string[]
          features: string[]
          rating: number
          review_count: number
          featured: boolean
          available: boolean
          verified: boolean
          owner_id: string | null
          view_count: number
          favorite_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          location: string
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          price: number
          price_type: "buy" | "rent" | "shortlet"
          category: "buy" | "rent" | "shortlet"
          property_type?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          land_size?: number | null
          land_unit?: string | null
          max_guests?: number | null
          images?: string[]
          amenities?: string[]
          features?: string[]
          rating?: number
          review_count?: number
          featured?: boolean
          available?: boolean
          verified?: boolean
          owner_id?: string | null
          view_count?: number
          favorite_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          location?: string
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          price?: number
          price_type?: "buy" | "rent" | "shortlet"
          category?: "buy" | "rent" | "shortlet"
          property_type?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          land_size?: number | null
          land_unit?: string | null
          max_guests?: number | null
          images?: string[]
          amenities?: string[]
          features?: string[]
          rating?: number
          review_count?: number
          featured?: boolean
          available?: boolean
          verified?: boolean
          owner_id?: string | null
          view_count?: number
          favorite_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status: "pending" | "confirmed" | "cancelled" | "completed"
          payment_status: "pending" | "paid" | "refunded"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          payment_status?: "pending" | "paid" | "refunded"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          check_in?: string
          check_out?: string
          guests?: number
          total_price?: number
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          payment_status?: "pending" | "paid" | "refunded"
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string | null
          receiver_id: string | null
          property_id: string | null
          subject: string | null
          content: string
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          property_id?: string | null
          subject?: string | null
          content: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          property_id?: string | null
          subject?: string | null
          content?: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
