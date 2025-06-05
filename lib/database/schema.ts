// Database schema definitions for Prisma or similar ORM

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: "user" | "agent" | "admin"
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Property {
  id: string
  title: string
  description: string
  location: string
  address: string
  city: string
  state: string
  country: string
  price: number
  priceType: "buy" | "rent" | "shortlet"
  category: "buy" | "rent" | "shortlet"
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  landSize?: number
  landUnit?: string
  maxGuests?: number
  images: string[]
  amenities: string[]
  features: string[]
  rating?: number
  reviewCount?: number
  featured: boolean
  available: boolean
  verified: boolean
  ownerId: string
  owner: User
  createdAt: Date
  updatedAt: Date
  viewCount: number
  favoriteCount: number
}

export interface Booking {
  id: string
  propertyId: string
  property: Property
  userId: string
  user: User
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  propertyId: string
  property: Property
  userId: string
  user: User
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

export interface Favorite {
  id: string
  propertyId: string
  property: Property
  userId: string
  user: User
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  sender: User
  receiverId: string
  receiver: User
  propertyId?: string
  property?: Property
  subject: string
  content: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}
