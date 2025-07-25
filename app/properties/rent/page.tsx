"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyGrid } from "@/components/properties/property-grid"

export default function RentPropertiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Properties for Rent</h1>
            <p className="text-gray-600">Find the perfect rental property for your lifestyle and budget.</p>
          </div>
          <PropertyGrid category="rent" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
