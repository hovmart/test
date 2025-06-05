import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingManagement } from "@/components/user/booking-management"

export default function BookingsPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <BookingManagement />
        </div>
      </main>
      <Footer />
    </div>
  )
}
