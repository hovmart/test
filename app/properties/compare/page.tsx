import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import PropertyComparisonWrapper from "@/components/properties/property-comparison-wrapper"
import "./styles.css"

export const metadata: Metadata = {
  title: "Compare Properties | Hovmart Limited",
  description: "Compare different properties side by side to find the perfect match for your needs.",
}

export default function ComparePropertiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8f8fa]">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PropertyComparisonWrapper />
        </div>
      </main>
      <Footer />
    </div>
  )
}
