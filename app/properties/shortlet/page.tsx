import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyGrid } from "@/components/properties/property-grid"

export default function ShortletPropertiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Shortlet Properties</h1>
            <p className="text-gray-600">Book comfortable short-term accommodations for your stay.</p>
          </div>
          <PropertyGrid category="shortlet" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
