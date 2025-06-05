"use client"

import dynamic from "next/dynamic"

// Use dynamic import with SSR disabled for the PropertyComparison component
// This ensures that any client-side only libraries like Recharts work properly
const PropertyComparison = dynamic(() => import("@/components/properties/property-comparison"), { ssr: false })

export default function PropertyComparisonWrapper() {
  return <PropertyComparison />
}
