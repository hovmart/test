import { UserProfile } from "@clerk/nextjs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="flex justify-center">
            <UserProfile
              appearance={{
                elements: {
                  card: "shadow-2xl border-0 w-full max-w-4xl",
                  navbar: "bg-hovmart-purple/5",
                  navbarButton: "text-hovmart-purple hover:bg-hovmart-purple/10",
                  navbarButtonIcon: "text-hovmart-purple",
                  pageScrollBox: "bg-white",
                  formButtonPrimary: "bg-hovmart-purple hover:bg-hovmart-dark",
                },
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
