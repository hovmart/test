"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Mail, Search, CheckCircle, XCircle } from "lucide-react"

interface TestResult {
  service: string
  status: "pending" | "success" | "error"
  message: string
  details?: any
}

export function IntegrationTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const updateTestResult = (service: string, status: TestResult["status"], message: string, details?: any) => {
    setTestResults((prev) => {
      const existing = prev.find((r) => r.service === service)
      if (existing) {
        existing.status = status
        existing.message = message
        existing.details = details
        return [...prev]
      }
      return [...prev, { service, status, message, details }]
    })
  }

  const testCloudinary = async () => {
    updateTestResult("Cloudinary", "pending", "Testing image upload...")

    if (!selectedFile) {
      updateTestResult("Cloudinary", "error", "Please select a file first")
      return
    }

    try {
      const formData = new FormData()
      formData.append("files", selectedFile)
      formData.append("type", "test")
      formData.append("folder", "test")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        updateTestResult("Cloudinary", "success", "Image uploaded successfully", result.files[0])
      } else {
        updateTestResult("Cloudinary", "error", result.error || "Upload failed")
      }
    } catch (error) {
      updateTestResult("Cloudinary", "error", `Upload error: ${error}`)
    }
  }

  const testResend = async () => {
    updateTestResult("Resend", "pending", "Testing email service...")

    try {
      const response = await fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: "test@example.com",
          userName: "Test User",
        }),
      })

      const result = await response.json()

      if (result.success) {
        updateTestResult("Resend", "success", "Email sent successfully")
      } else {
        updateTestResult("Resend", "error", result.error || "Email failed")
      }
    } catch (error) {
      updateTestResult("Resend", "error", `Email error: ${error}`)
    }
  }

  const testAlgolia = async () => {
    updateTestResult("Algolia", "pending", "Testing search functionality...")

    try {
      const response = await fetch("/api/search?q=apartment&category=rent&limit=5")
      const result = await response.json()

      if (result.success) {
        updateTestResult("Algolia", "success", `Search returned ${result.hits?.length || 0} results`, {
          hits: result.hits?.length || 0,
          processingTime: result.processingTimeMS,
        })
      } else {
        updateTestResult("Algolia", "error", result.error || "Search failed")
      }
    } catch (error) {
      updateTestResult("Algolia", "error", `Search error: ${error}`)
    }
  }

  const testSuggestions = async () => {
    updateTestResult("Algolia Suggestions", "pending", "Testing search suggestions...")

    try {
      const response = await fetch("/api/search/suggestions?q=lag&limit=3")
      const result = await response.json()

      if (result.success) {
        updateTestResult("Algolia Suggestions", "success", `Got ${result.suggestions?.length || 0} suggestions`, {
          suggestions: result.suggestions?.length || 0,
        })
      } else {
        updateTestResult("Algolia Suggestions", "error", result.error || "Suggestions failed")
      }
    } catch (error) {
      updateTestResult("Algolia Suggestions", "error", `Suggestions error: ${error}`)
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    // Test all services
    await testAlgolia()
    await testSuggestions()
    await testResend()

    if (selectedFile) {
      await testCloudinary()
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Integration Test Dashboard</h1>
        <p className="text-gray-600">Test all Hovmart integrations: Cloudinary, Resend, and Algolia</p>
      </div>

      {/* File Upload for Cloudinary Test */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Cloudinary Test Setup
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Image for Upload Test</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
          </div>
          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>
      </Card>

      {/* Test Controls */}
      <div className="flex justify-center space-x-4">
        <Button onClick={runAllTests} disabled={isRunning} className="bg-hovmart-purple hover:bg-hovmart-light">
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            "Run All Tests"
          )}
        </Button>

        <Button variant="outline" onClick={testAlgolia} disabled={isRunning}>
          <Search className="h-4 w-4 mr-2" />
          Test Search
        </Button>

        <Button variant="outline" onClick={testResend} disabled={isRunning}>
          <Mail className="h-4 w-4 mr-2" />
          Test Email
        </Button>

        <Button variant="outline" onClick={testCloudinary} disabled={isRunning || !selectedFile}>
          <Upload className="h-4 w-4 mr-2" />
          Test Upload
        </Button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">{getStatusIcon(result.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900">{result.service}</h3>
                    <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{result.message}</p>
                  {result.details && (
                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <pre>{JSON.stringify(result.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Integration Status Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <Upload className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-medium">Cloudinary</h3>
            <p className="text-sm text-gray-600">Image Storage & Optimization</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Mail className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-medium">Resend</h3>
            <p className="text-sm text-gray-600">Email Service</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <Search className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-medium">Algolia</h3>
            <p className="text-sm text-gray-600">Advanced Search</p>
          </div>
        </div>
      </Card>

      {/* Environment Variables Check */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Cloudinary</h3>
            <ul className="space-y-1 text-gray-600">
              <li>✓ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</li>
              <li>✓ CLOUDINARY_API_KEY</li>
              <li>✓ CLOUDINARY_API_SECRET</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Resend</h3>
            <ul className="space-y-1 text-gray-600">
              <li>✓ RESEND_API_KEY</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Algolia</h3>
            <ul className="space-y-1 text-gray-600">
              <li>✓ NEXT_PUBLIC_ALGOLIA_APP_ID</li>
              <li>✓ NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY</li>
              <li>✓ ALGOLIA_ADMIN_API_KEY</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
