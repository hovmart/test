"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Key, Shield, Smartphone, Eye, EyeOff, CheckCircle, AlertTriangle, Trash2 } from "lucide-react"

export function ProfileSecurity() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      // In a real implementation, you would call Supabase auth.updateUser
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            onClick={handlePasswordUpdate}
            disabled={isUpdating || !passwordData.currentPassword || !passwordData.newPassword}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isUpdating ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-gray-600 text-sm mt-1">Add an extra layer of security to your account</p>
                <Badge variant="outline" className="mt-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Not Enabled
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              <Smartphone className="h-4 w-4 mr-2" />
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Verification */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <CheckCircle className={`h-5 w-5 mt-1 ${user.verified ? "text-green-600" : "text-yellow-600"}`} />
              <div>
                <h3 className="text-lg font-medium">Account Verification</h3>
                <p className="text-gray-600 text-sm mt-1">Verify your account to access all features</p>
                <Badge
                  variant={user.verified ? "default" : "secondary"}
                  className={`mt-2 ${user.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {user.verified ? "Verified" : "Pending Verification"}
                </Badge>
              </div>
            </div>
            {!user.verified && (
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                Verify Account
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <Trash2 className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-red-900">Delete Account</h3>
                <p className="text-red-700 text-sm mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
