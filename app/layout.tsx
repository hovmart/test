import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/lib/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Hovmart - Premium Property Marketplace",
  description:
    "Discover luxury properties for buy, rent, and shortlet across Nigeria. Your gateway to premium real estate.",
  keywords: "real estate, property, Nigeria, Lagos, buy, rent, shortlet, luxury homes",
  authors: [{ name: "Hovmart Team" }],
  openGraph: {
    title: "Hovmart - Premium Property Marketplace",
    description:
      "Discover luxury properties for buy, rent, and shortlet across Nigeria. Your gateway to premium real estate.",
    url: "https://hovmart.com",
    siteName: "Hovmart",
    images: [
      {
        url: "/hovmart-billboard.png",
        width: 1200,
        height: 630,
        alt: "Hovmart - Premium Property Marketplace",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hovmart - Premium Property Marketplace",
    description:
      "Discover luxury properties for buy, rent, and shortlet across Nigeria. Your gateway to premium real estate.",
    images: ["/hovmart-billboard.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
