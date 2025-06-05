"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  CreditCard,
  Key,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Settings,
  Smartphone,
  AlertTriangle,
  Download,
  FileText,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileImageUpload } from "./profile-image-upload"
import { profileUpdateSchema, passwordUpdateSchema } from "@/lib/validations/profile"
import { z } from "zod"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function EnhancedProfileManagement() {
  const { user, updateProfile, isUpdatingProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    date_of_birth: "",
    bio: "",
  })

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

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: true,
    push: false,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        address: user.address || "",
        date_of_birth: user.date_of_birth || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-hovmart-purple border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const validatedData = profileUpdateSchema.parse(formData)
      const result = await updateProfile(validatedData)

      if (result.success) {
        setIsEditing(false)
        toast({
          title: "✅ Profile updated successfully",
          description: "Your profile information has been saved.",
        })
      } else {
        toast({
          title: "❌ Update failed",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]
        toast({
          title: "⚠️ Validation Error",
          description: firstError.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "❌ Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
  }

  const handlePasswordUpdate = async () => {
    try {
      passwordUpdateSchema.parse(passwordData)
      setIsUpdatingPassword(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "🔒 Password updated successfully",
        description: "Your password has been changed.",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0]
        toast({
          title: "⚠️ Validation Error",
          description: firstError.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "🔔 Notification settings updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${value ? "enabled" : "disabled"}`,
    })
  }

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    toast({
      title: twoFactorEnabled ? "🔓 2FA Disabled" : "🔐 2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled"
        : "Two-factor authentication has been enabled",
    })
  }

  const handleExportData = () => {
    toast({
      title: "📥 Data export initiated",
      description: "Your data export will be emailed to you within 24 hours.",
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "🗑️ Account deletion requested",
      description: "Your account deletion request has been submitted.",
      variant: "destructive",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getVerificationStatus = () => {
    if (user.verified) {
      return {
        icon: CheckCircle,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200",
        text: "Verified Account",
      }
    }
    return {
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      text: "Pending Verification",
    }
  }

  const verificationStatus = getVerificationStatus()

  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "text-blue-600" },
    { id: "security", label: "Security", icon: Shield, color: "text-red-600" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "text-yellow-600" },
    { id: "billing", label: "Billing", icon: CreditCard, color: "text-green-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Enhanced Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-hovmart-purple via-hovmart-dark to-purple-900">
            <div className="relative p-8 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox=\"0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="#ffffff" fillOpacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
              
              <div className="relative flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <ProfileImageUpload
                  currentImage={user.avatar_url || ""}
                  userName={user.full_name || user.email}
                  onImageUpdate={(imageUrl) => {
                    // Update user state immediately for UI feedback
                    updateProfile({ avatar_url: imageUrl })
                  }}
                />
                
                <div className="text-center lg:text-left flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      {user.full_name || "Welcome User"}
                    </h1>
                    <Badge className={`${verificationStatus.bg} ${verificationStatus.color} border-0 px-3 py-1`}>
                      <verificationStatus.icon className="w-4 h-4 mr-2" />
                      {verificationStatus.text}
                    </Badge>
                  </div>
                  
                  <p className="text-white/80 text-lg mb-2">{user.email}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Member since {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    {user.phone && (
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Tabs with Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <div className="border-b border-gray-100">
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 px-8 py-6 font-medium text-sm whitespace-nowrap border-b-3 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "border-hovmart-purple text-hovmart-purple bg-hovmart-purple/5"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ""}`} />
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-gray-600 mt-1">Manage your personal details and preferences</p>
                      </div>
                      {!isEditing ? (
                        <Button 
                          onClick={() => setIsEditing(true)} 
                          className="bg-hovmart-purple hover:bg-hovmart-dark text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex space-x-3">
                          <Button
                            onClick={handleSave}
                            disabled={isUpdatingProfile}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdatingProfile ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button
                            onClick={() => {
                              setIsEditing(false)
                              setFormData({
                                full_name: user.full_name || "",
                                phone: user.phone || "",
                                address: user.address || "",
                                date_of_birth: user.date_of_birth || "",
                                bio: user.bio || "",
                              })
                            }}
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                        {isEditing ? (
                          <Input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="h-12 border-2 border-gray-200 focus:border-hovmart-purple transition-colors"
                          />
                        ) : (
                          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                            <User className="w-5 h-5 text-hovmart-purple" />
                            <span className="font-medium">{user.full_name || "Not provided"}</span>
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                          <Mail className="w-5 h-5 text-hovmart-purple" />
                          <span className="font-medium">{user.email}</span>
                          <Badge variant="secondary" className="ml-auto">Protected</Badge>
                        </div>
                        <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
                        {isEditing ? (
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+234 xxx xxx xxxx"
                            className="h-12 border-2 border-gray-200 focus:border-hovmart-purple transition-colors"
                          />
                        ) : (
                          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                            <Phone className="w-5 h-5 text-hovmart-purple" />
                            <span className="font-medium">{user.phone || "Not provided"}</span>
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Date of Birth</label>
                        {isEditing ? (
                          <Input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                            className="h-12 border-2 border-gray-200 focus:border-hovmart-purple transition-colors"
                          />
                        ) : (
                          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                            <Calendar className="w-5 h-5 text-hovmart-purple" />
                            <span className="font-medium">
                              {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "Not provided"}
                            </span>
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="lg:col-span-2 space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Address</label>
                        {isEditing ? (
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                            className="h-12 border-2 border-gray-200 focus:border-hovmart-purple transition-colors"
                          />
                        ) : (
                          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                            <MapPin className="w-5 h-5 text-hovmart-purple" />
                            <span className="font-medium">{user.address || "Not provided"}</span>
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="lg:col-span-2 space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Bio</label>
                        {isEditing ? (
                          <Textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Tell us about yourself..."
                            className="border-2 border-gray-200 focus:border-hovmart-purple transition-colors resize-none"
                          />
                        ) : (
                          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 min-h-[120px]">
                            <span className="text-gray-700">{user.bio || "No bio provided"}</span>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                      <p className="text-gray-600 mt-1">Manage your account security and privacy</p>
                    </div>

                    {/* Change Password */}
                    <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <Key className="h-6 w-6 text-blue-600" />
                          Change Password
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                            <div className="relative">
                              <Input
                                type={showPasswords.current ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                                className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">New Password</label>
                            <div className="relative">
                              <Input
                                type={showPasswords.new ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                                className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                            <div className="relative">
                              <Input
                                type={showPasswords.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Confirm new password"
                                className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handlePasswordUpdate}
                          disabled={isUpdatingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isUpdatingPassword ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <Key className="w-4 h-4 mr-2" />
                              Update Password
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Two-Factor Authentication */}
                    <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <Shield className="h-6 w-6 text-green-600 mt-1" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                              <p className="text-gray-600 text-sm mt-1">Add an extra layer of security to your account</p>
                              <Badge 
                                variant={twoFactorEnabled ? "default" : "secondary"} 
                                className={`mt-3 ${twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                              >
                                {twoFactorEnabled ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Enabled
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Disabled
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            onClick={handleTwoFactorToggle}
                            variant={twoFactorEnabled ? "destructive" : "default"}
                            className="shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Smartphone className="h-4 w-4 mr-2" />
                            {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Account Verification */}
                    <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <CheckCircle className={`h-6 w-6 mt-1 ${user.verified ? "text-green-600" : "text-yellow-600"}`} />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Account Verification</h3>
                              <p className="text-gray-600 text-sm mt-1">Verify your account to access all features</p>
                              <Badge
                                variant={user.verified ? "default" : "secondary"}
                                className={`mt-3 ${user.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                              >
                                {user.verified ? "Verified Account" : "Pending Verification"}
                              </Badge>
                            </div>
                          </div>
                          {!user.verified && (
                            <Button 
                              variant="outline" 
                              className="border-hovmart-purple text-hovmart-purple hover:bg-hovmart-purple hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Verify Account
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Data Export */}
                    <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <Download className="h-6 w-6 text-blue-600 mt-1" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Export Your Data</h3>
                              <p className="text-gray-600 text-sm mt-1">Download a copy of all your account data</p>
                            </div>
                          </div>
                          <Button 
                            onClick={handleExportData}
                            variant="outline" 
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Export Data
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-2 border-red-200 bg-red-50/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <Trash2 className="h-6 w-6 text-red-600 mt-1" />
                            <div>
                              <h3 className="text-lg font-semibold text-red-900">Delete Account</h3>
                              <p className="text-red-700 text-sm mt-1">
                                Permanently delete your account and all associated data. This action cannot be undone.
                              </p>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                className="shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                  Yes, delete my account
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-600 mt-1">Choose how you want to be notified about updates</p>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          key: "email",
                          title: "Email Notifications",
                          description: "Receive updates about your bookings and account",
                          icon: Mail,
                          color: "text-blue-600",
                        },
                        {
                          key: "sms",
                          title: "SMS Notifications",
                          description: "Get text messages for urgent updates",
                          icon: Phone,
                          color: "text-green-600",
                        },
                        {
                          key: "marketing",
                          title: "Marketing Communications",
                          description: "Receive promotional offers and property recommendations",
                          icon: Bell,
                          color: "text-purple-600",
                        },
                        {
                          key: "push",
                          title: "Push Notifications",
                          description: "Browser notifications for real-time updates",
                          icon: Settings,
                          color: "text-orange-600",
                        },
                      ].map((notification) => (
                        <motion.div
                          key={notification.key}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-center">
                                <div className="flex items-start space-x-4">
                                  <notification.icon className={`h-6 w-6 ${notification.color} mt-1`} />
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{notification.description}</p>
                                  </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={notifications[notification.key as keyof typeof notifications]}
                                    onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                                  />
                                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-hovmart-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-hovmart-purple shadow-lg"></div>
                                </label>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Billing Tab */}
                {activeTab === "billing" && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Billing & Payment</h2>
                      <p className="text-gray-600 mt-1">Manage your payment methods and billing history</p>
                    </div>

                    <Card className="border-2 border-gray-100">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <CreditCard className="h-6 w-6 text-green-600" />
                          Payment Methods
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                              <p className="text-sm text-gray-600">Expires 12/25 • Visa</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Primary</Badge>
                          </div>
                          <Button variant="outline" size="sm" className="shadow-lg hover:shadow-xl transition-all duration-300">
                            Edit
                          </Button>
                        </motion.div>
                        <Button variant="outline" className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-hovmart-purple hover:bg-hovmart-purple/5 transition-all duration-300">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Add New Payment Method
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-gray-100">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <FileText className="h-6 w-6 text-purple-600" />
                          Billing History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          {
                            description: "Property Booking - Luxury Apartment",
                            date: "Dec 15, 2023",
                            amount: "₦1,250,000",
                            status: "Completed",
                          },
                          {
                            description: "Property Booking - Elegant Villa",
                            date: "Nov 28, 2023",
                            amount: "₦2,250,000",
                            status: "Completed",
                          },
                          {
                            description: "Property Booking - Modern Penthouse",
                            date: "Oct 12, 2023",
                            amount: "₦3,500,000",
                            status: "Completed",
                          },
                        ].map((transaction, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{transaction.description}</p>
                                <p className="text-sm text-gray-600">{transaction.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-lg text-gray-900">{transaction.amount}</span>
                              <Badge className="ml-3 bg-green-100 text-green-800">{transaction.status}</Badge>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
  </div>
  )
}
