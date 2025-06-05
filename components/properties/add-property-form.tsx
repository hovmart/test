"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Home, MapPin, DollarSign, Bed, Bath, Users, Upload, X, Check, Info, Loader2 } from "lucide-react"
import { useCreateProperty } from "@/hooks/use-properties"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface AddPropertyFormProps {
  inModal?: boolean
  onSuccess?: () => void
}

export function AddPropertyForm({ inModal = false, onSuccess }: AddPropertyFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const createPropertyMutation = useCreateProperty()

  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    city: "",
    state: "",
    price: "",
    priceType: "rent" as "buy" | "rent" | "shortlet",
    propertyType: "",
    beds: "",
    baths: "",
    squareFeet: "",
    maxGuests: "",
    landSize: "",
    landUnit: "sqm",
    availableFrom: "",
    availableTo: "",
    categories: [] as string[],
    amenities: [] as string[],
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)

  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "penthouse", label: "Penthouse" },
    { value: "studio", label: "Studio" },
    { value: "shortlet", label: "Shortlet" },
    { value: "cabin", label: "Cabin" },
    { value: "farmhouse", label: "Farmhouse" },
    { value: "commercial", label: "Commercial" },
    { value: "land", label: "Land" },
    { value: "plot", label: "Plot" },
    { value: "farm", label: "Farm" },
  ]

  const priceTypes = [
    { value: "rent", label: "For Rent" },
    { value: "buy", label: "For Sale" },
    { value: "shortlet", label: "Short-term Rental" },
  ]

  const categoryOptions = [
    { id: "apartments", label: "Apartments" },
    { id: "shortlets", label: "Shortlet Apartments" },
    { id: "beachfront", label: "Beachfront" },
    { id: "luxury", label: "Luxury Homes" },
    { id: "vacation", label: "Vacation Homes" },
    { id: "mountain", label: "Mountain View" },
    { id: "countryside", label: "Countryside" },
    { id: "commercial", label: "Commercial" },
    { id: "land", label: "Land" },
    { id: "plots", label: "Plots" },
    { id: "farms", label: "Farms" },
  ]

  const amenityOptions = [
    { id: "wifi", label: "Wi-Fi" },
    { id: "kitchen", label: "Kitchen" },
    { id: "aircon", label: "Air conditioning" },
    { id: "washer", label: "Washing machine" },
    { id: "parking", label: "Free parking" },
    { id: "pool", label: "Swimming Pool" },
    { id: "security", label: "Security" },
    { id: "gym", label: "Gym access" },
    { id: "beach", label: "Beach access" },
    { id: "garden", label: "Garden" },
    { id: "balcony", label: "Balcony" },
    { id: "tv", label: "TV" },
    { id: "workspace", label: "Workspace" },
    { id: "bbq", label: "BBQ grill" },
    { id: "generator", label: "Generator" },
    { id: "elevator", label: "Elevator" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, type: "categories" | "amenities") => {
    const { value, checked } = e.target
    if (checked) {
      setFormData({
        ...formData,
        [type]: [...formData[type], value],
      })
    } else {
      setFormData({
        ...formData,
        [type]: formData[type].filter((item) => item !== value),
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages = Array.from(files)
    const newImageUrls = newImages.map((file) => URL.createObjectURL(file))

    setImages([...images, ...newImages])
    setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newImageUrls = [...imagePreviewUrls]

    URL.revokeObjectURL(newImageUrls[index])

    newImages.splice(index, 1)
    newImageUrls.splice(index, 1)

    setImages(newImages)
    setImagePreviewUrls(newImageUrls)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required"
      if (!formData.description.trim()) newErrors.description = "Description is required"
      if (!formData.location.trim()) newErrors.location = "Location is required"
      if (!formData.price.trim()) newErrors.price = "Price is required"
      else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
        newErrors.price = "Price must be a positive number"
    } else if (step === 2) {
      if (!formData.propertyType) newErrors.propertyType = "Property type is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.state.trim()) newErrors.state = "State is required"

      const isLandedProperty = ["land", "plot", "farm"].includes(formData.propertyType)

      if (!isLandedProperty) {
        if (!formData.beds.trim()) newErrors.beds = "Number of beds is required"
        else if (isNaN(Number(formData.beds)) || Number(formData.beds) < 0)
          newErrors.beds = "Beds must be a non-negative number"
        if (!formData.baths.trim()) newErrors.baths = "Number of baths is required"
        else if (isNaN(Number(formData.baths)) || Number(formData.baths) < 0)
          newErrors.baths = "Baths must be a non-negative number"
        if (!formData.maxGuests.trim()) newErrors.maxGuests = "Maximum guests is required"
        else if (isNaN(Number(formData.maxGuests)) || Number(formData.maxGuests) <= 0)
          newErrors.maxGuests = "Maximum guests must be a positive number"
      } else {
        if (!formData.landSize.trim()) newErrors.landSize = "Land size is required"
        else if (isNaN(Number(formData.landSize)) || Number(formData.landSize) <= 0)
          newErrors.landSize = "Land size must be a positive number"
      }
    } else if (step === 3) {
      if (formData.categories.length === 0) newErrors.categories = "Select at least one category"
      if (formData.amenities.length === 0) newErrors.amenities = "Select at least one amenity"
    } else if (step === 4) {
      if (images.length === 0) newErrors.images = "Upload at least one image"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to list a property.",
        variant: "destructive",
      })
      return
    }

    try {
      // For now, we'll store image URLs as placeholder paths
      // In a real app, you'd upload images to storage first
      const imageUrls = images.map((_, index) => `/property-images/placeholder-${Date.now()}-${index}.jpg`)

      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        price: Number.parseFloat(formData.price),
        price_type: formData.priceType,
        category: formData.priceType,
        property_type: formData.propertyType,
        bedrooms: formData.beds ? Number.parseInt(formData.beds) : null,
        bathrooms: formData.baths ? Number.parseInt(formData.baths) : null,
        square_feet: formData.squareFeet ? Number.parseInt(formData.squareFeet) : null,
        land_size: formData.landSize ? Number.parseFloat(formData.landSize) : null,
        land_unit: formData.landUnit,
        max_guests: formData.maxGuests ? Number.parseInt(formData.maxGuests) : null,
        images: imageUrls,
        amenities: formData.amenities,
        categories: formData.categories,
        owner_id: user.id,
        status: "pending" as const,
      }

      await createPropertyMutation.mutateAsync(propertyData)

      setShowSuccess(true)
      toast({
        title: "Property listed successfully!",
        description: "Your property has been submitted for review.",
      })

      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/properties")
        }
      }, 3000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to list property. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isLandedProperty = ["land", "plot", "farm"].includes(formData.propertyType)

  if (showSuccess) {
    return (
      <div className={`bg-white rounded-xl shadow-lg ${inModal ? "p-6" : "p-8"} text-center`}>
        <div
          className={`${inModal ? "w-12 h-12" : "w-16 h-16"} bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Check className={`${inModal ? "h-6 w-6" : "h-8 w-8"} text-green-600`} />
        </div>
        <h2 className={`${inModal ? "text-xl" : "text-2xl"} font-bold mb-3 font-poppins`}>
          Property Listed Successfully!
        </h2>
        <p className="text-gray-600 mb-4 font-poppins">
          Your property has been submitted for review. Our team will review your listing and it will be live soon.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/properties")}
            className="px-6 py-3 bg-gradient-to-r from-hovmart-purple to-hovmart-light text-white rounded-lg font-medium hover:shadow-md transition-shadow font-poppins"
          >
            Browse Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${inModal ? "max-w-none mx-0" : "max-w-3xl mx-auto"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 font-poppins">List Your Property</h1>
        <p className="text-gray-600 font-poppins">
          Fill out the form below to list your property on Hovmart. Reach thousands of potential buyers, renters, and
          guests.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step < currentStep
                    ? "bg-hovmart-purple text-white"
                    : step === currentStep
                      ? "bg-hovmart-purple/20 text-hovmart-purple border-2 border-hovmart-purple"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step < currentStep ? <Check className="h-5 w-5" /> : step}
              </div>
              <div
                className={`text-xs mt-2 font-medium font-poppins ${
                  step <= currentStep ? "text-hovmart-purple" : "text-gray-400"
                }`}
              >
                {step === 1 ? "Basic Info" : step === 2 ? "Property Details" : step === 3 ? "Features" : "Photos"}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-hovmart-purple rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6 font-poppins">Basic Information</h2>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                Property Title*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Luxury Apartment with Ocean View"
                  className={`pl-10 w-full rounded-lg border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                />
              </div>
              {errors.title && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your property in detail..."
                className={`w-full rounded-lg border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Victoria Island, Lagos"
                  className={`pl-10 w-full rounded-lg border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priceType" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                  Price Type*
                </label>
                <select
                  id="priceType"
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins"
                >
                  {priceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                  Price (₦)*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 50000"
                    className={`pl-10 w-full rounded-lg border ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.price}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                Property Type*
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  errors.propertyType ? "border-red-500" : "border-gray-300"
                } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
              >
                <option value="">Select property type</option>
                <optgroup label="Residential Properties">
                  {propertyTypes
                    .filter((type) => !["land", "plot", "farm"].includes(type.value))
                    .map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Landed Properties">
                  {propertyTypes
                    .filter((type) => ["land", "plot", "farm"].includes(type.value))
                    .map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                </optgroup>
              </select>
              {errors.propertyType && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.propertyType}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Property Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6 font-poppins">Property Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 123 Main Street"
                  className="w-full rounded-lg border border-gray-300 focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Lagos"
                  className={`w-full rounded-lg border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                State*
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="e.g. Lagos"
                className={`w-full rounded-lg border ${
                  errors.state ? "border-red-500" : "border-gray-300"
                } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
              />
              {errors.state && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.state}</p>}
            </div>

            {!isLandedProperty ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Beds*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Bed className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="beds"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="e.g. 2"
                      className={`pl-10 w-full rounded-lg border ${
                        errors.beds ? "border-red-500" : "border-gray-300"
                      } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                    />
                  </div>
                  {errors.beds && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.beds}</p>}
                </div>

                <div>
                  <label htmlFor="baths" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Baths*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Bath className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="baths"
                      name="baths"
                      value={formData.baths}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="e.g. 2"
                      className={`pl-10 w-full rounded-lg border ${
                        errors.baths ? "border-red-500" : "border-gray-300"
                      } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                    />
                  </div>
                  {errors.baths && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.baths}</p>}
                </div>

                <div>
                  <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Max Guests*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="maxGuests"
                      name="maxGuests"
                      value={formData.maxGuests}
                      onChange={handleInputChange}
                      min="1"
                      placeholder="e.g. 4"
                      className={`pl-10 w-full rounded-lg border ${
                        errors.maxGuests ? "border-red-500" : "border-gray-300"
                      } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                    />
                  </div>
                  {errors.maxGuests && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.maxGuests}</p>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="landSize" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Land Size*
                  </label>
                  <input
                    type="number"
                    id="landSize"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="e.g. 500"
                    className={`w-full rounded-lg border ${
                      errors.landSize ? "border-red-500" : "border-gray-300"
                    } focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins`}
                  />
                  {errors.landSize && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.landSize}</p>}
                </div>

                <div>
                  <label htmlFor="landUnit" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Unit
                  </label>
                  <select
                    id="landUnit"
                    name="landUnit"
                    value={formData.landUnit}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins"
                  >
                    <option value="sqm">Square Meters</option>
                    <option value="sqft">Square Feet</option>
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="plots">Plots</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                Square Feet
              </label>
              <input
                type="number"
                id="squareFeet"
                name="squareFeet"
                value={formData.squareFeet}
                onChange={handleInputChange}
                min="1"
                placeholder="e.g. 1200"
                className="w-full rounded-lg border border-gray-300 focus:ring-hovmart-purple focus:border-hovmart-purple font-poppins"
              />
            </div>
          </div>
        )}

        {/* Step 3: Features */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6 font-poppins">Features</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-poppins">Categories*</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryOptions.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={category.id}
                      checked={formData.categories.includes(category.id)}
                      onChange={(e) => handleCheckboxChange(e, "categories")}
                      className="rounded border-gray-300 text-hovmart-purple focus:ring-hovmart-purple"
                    />
                    <span className="font-poppins">{category.label}</span>
                  </label>
                ))}
              </div>
              {errors.categories && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.categories}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-poppins">Amenities*</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => (
                  <label key={amenity.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={amenity.label}
                      checked={formData.amenities.includes(amenity.label)}
                      onChange={(e) => handleCheckboxChange(e, "amenities")}
                      className="rounded border-gray-300 text-hovmart-purple focus:ring-hovmart-purple"
                    />
                    <span className="font-poppins">{amenity.label}</span>
                  </label>
                ))}
              </div>
              {errors.amenities && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.amenities}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6 font-poppins">Photos</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-poppins">
                Upload Property Photos* (Max 10)
              </label>

              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  errors.images ? "border-red-500" : "border-gray-300"
                } hover:border-hovmart-purple/50 transition-colors cursor-pointer`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                  disabled={images.length >= 10}
                />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-1 font-poppins">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 font-poppins">PNG, JPG, WEBP up to 10MB each</p>
              </div>
              {errors.images && <p className="mt-1 text-sm text-red-500 font-poppins">{errors.images}</p>}

              {imagePreviewUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 font-poppins">Uploaded Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Property image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-700 font-poppins">
                <p className="font-medium mb-1">Tips for great property photos:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use natural lighting when possible</li>
                  <li>Capture all rooms and key features</li>
                  <li>Keep the space clean and tidy</li>
                  <li>Include exterior shots and views</li>
                  <li>Use landscape orientation for better display</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:border-hovmart-purple/50 transition-colors font-poppins"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-hovmart-purple to-hovmart-light text-white rounded-lg font-medium hover:shadow-md transition-shadow font-poppins"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={createPropertyMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-hovmart-purple to-hovmart-light text-white rounded-lg font-medium hover:shadow-md transition-shadow disabled:opacity-70 flex items-center font-poppins"
            >
              {createPropertyMutation.isPending && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              {createPropertyMutation.isPending ? "Submitting..." : "Submit Listing"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
