"use client"

import type React from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({
  children,
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hovmart-purple"></div>
    </div>
  ),
  redirectTo = "/sign-in",
}: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectTo)
    }
  }, [isLoaded, isSignedIn, router, redirectTo])

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return <>{fallback}</>
  }

  // Show fallback if not signed in
  if (!isSignedIn) {
    return <>{fallback}</>
  }

  // User is authenticated, show protected content
  return <>{children}</>
}
