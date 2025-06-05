import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/profile(.*)",
  "/bookings(.*)",
  "/favorites(.*)",
  "/properties/add(.*)",
])

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/properties",
  "/properties/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/properties(.*)",
  "/api/webhooks(.*)",
  "/api/search(.*)",
  "/test(.*)",
])

export default clerkMiddleware((auth, req) => {
  // Allow public routes to pass through
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // For protected routes, check if user is authenticated
  if (isProtectedRoute(req)) {
    const { userId } = auth()

    if (!userId) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
