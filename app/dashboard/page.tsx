import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

"use client"
import { AuthGuard } from "@/components/auth/auth-guard"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <UserDashboard />
    </AuthGuard>
  )
}

