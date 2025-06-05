"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { UploadCloud, MapPin, X, Check, Loader2, ImageIcon } from "lucide-react"
import { useCreateAdminProperty, useUploadPropertyImages } from "@/hooks/use-admin"
import { toast } from "@/hooks/use-toast"

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  propertyType: z.string().min(1, "Please select a property type"),
  priceType: z.string().min(1, "Please select a price type"),
  price: z.number().min(1, "Price must be greater than 0"),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  squareFeet: z.number().optional(),
  landSize: z.number().optional(),
  landUnit: z.string().optional(),
  maxGuests: z.number().optional(),
  address: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  featured: z.boolean().default(false),
  verified: z.boolean().default(true),
  amenities: z.array(z.string()).optional(),
})

const amenitiesList = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
  "Air Conditioning",
  "Furnished",
  "Balcony",
  "Garden",
  "Elevator",
  "Internet",
  "Cable TV",
  "Washing Machine",
  "Dishwasher",
  "Microwave",
  "Refrigerator",
  "Oven",
  "Water Supply",
  "Electricity",
  "Gated Community",
  "CCTV",
  "Generator",
  "Playground",
  "Tennis Court",
  "Golf Course",
]

export default function FunctionalAdminAddProperty() {
  const [selectedPropertyType, setSelectedPropertyType] = useState("apartment")
  const [selectedPriceType, setSelectedPriceType] = useState("rent")
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [currentTab, setCurrentTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createPropertyMutation = useCreateAdminProperty()
  const uploadImagesMutation = useUploadPropertyImages()

  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "apartment",
      priceType: "rent",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      landSize: 0,
      landUnit: "sqm",
      maxGuests: 1,
      address: "",
      city: "",
      state: "",
      location: "",
      featured: false,
      verified: true,
      amenities: [],
    },
  })

  const handlePropertyTypeChange = (value: string) => {
    setSelectedPropertyType(value)
    form.setValue("propertyType", value)
  }

  const handlePriceTypeChange = (value: string) => {
    setSelectedPriceType(value)
    form.setValue("priceType", value)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)

      // Validate file types and sizes
      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          })
          return false
        }
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than 10MB`,
            variant: "destructive",
          })
          return false
        }
        return true
      })

      if (images.length + validFiles.length > 10) {
        toast({
          title: "Too many images",
          description: "Maximum 10 images allowed",
          variant: "destructive",
        })
        return
      }

      setImages([...images, ...validFiles])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity])
    } else {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity))
    }
  }

  const onSubmit = async (values: z.infer<typeof propertySchema>) => {
    try {
      setIsSubmitting(true)

      // Upload images first if any
      let uploadedImageUrls: string[] = []
      if (images.length > 0) {
        const uploadResult = await uploadImagesMutation.mutateAsync(images)
        uploadedImageUrls = uploadResult.urls
      }

      // Prepare property data
      const propertyData = {
        title: values.title,
        description: values.description,
        location: values.location,
        address: values.address || "",
        city: values.city,
        state: values.state,
        country: "Nigeria",
        price: values.price,
        priceType: values.priceType,
        propertyType: values.propertyType,
        bedrooms: values.bedrooms || 0,
        bathrooms: values.bathrooms || 0,
        squareFeet: values.squareFeet || 0,
        landSize: values.landSize || 0,
        landUnit: values.landUnit || "sqm",
        maxGuests: values.maxGuests || 1,
        images: uploadedImageUrls,
        amenities: selectedAmenities,
        features: selectedAmenities,
        featured: values.featured,
        verified: values.verified,
      }

      await createPropertyMutation.mutateAsync(propertyData)

      // Reset form
      form.reset()
      setImages([])
      setImageUrls([])
      setSelectedAmenities([])
      setCurrentTab("basic")

      toast({
        title: "Success!",
        description: "Property has been created successfully",
      })
    } catch (error: any) {
      console.error("Error creating property:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLandedProperty = ["land", "plot", "farm"].includes(selectedPropertyType)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Add New Property
          </h1>
          <p className="text-gray-600 mt-2">Create a new property listing with detailed information</p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Property Details</CardTitle>
          <CardDescription className="text-purple-100">
            Fill out all the required information to create a comprehensive property listing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-8 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    Property Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    Location
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    Media & Amenities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-lg font-semibold">Property Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a descriptive property title"
                              className="h-12 text-lg border-2 focus:border-purple-500 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>A clear, descriptive title for the property</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Property Type *</FormLabel>
                          <Select onValueChange={handlePropertyTypeChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-lg border-2 focus:border-purple-500">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="penthouse">Penthouse</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                              <SelectItem value="condo">Condominium</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="land">Land</SelectItem>
                              <SelectItem value="plot">Plot</SelectItem>
                              <SelectItem value="farm">Farm</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="office">Office Space</SelectItem>
                              <SelectItem value="warehouse">Warehouse</SelectItem>
                              <SelectItem value="retail">Retail Space</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Price Type *</FormLabel>
                          <Select onValueChange={handlePriceTypeChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-lg border-2 focus:border-purple-500">
                                <SelectValue placeholder="Select price type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="rent">For Rent</SelectItem>
                              <SelectItem value="buy">For Sale</SelectItem>
                              <SelectItem value="shortlet">Short-term Rental</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Price (₦) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              className="h-12 text-lg border-2 focus:border-purple-500"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Location *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Victoria Island, Lagos"
                              className="h-12 text-lg border-2 focus:border-purple-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of the property"
                            className="min-h-32 text-lg border-2 focus:border-purple-500 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Provide a detailed description of the property</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border-2 border-purple-200 p-4 bg-purple-50">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-semibold">Featured Property</FormLabel>
                            <FormDescription>This property will be displayed in featured sections</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="verified"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border-2 border-green-200 p-4 bg-green-50">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-semibold">Verified Property</FormLabel>
                            <FormDescription>This property has been verified by admin</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  {!isLandedProperty ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Bedrooms</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Number of bedrooms"
                                className="h-12 text-lg border-2 focus:border-purple-500"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Bathrooms</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Number of bathrooms"
                                className="h-12 text-lg border-2 focus:border-purple-500"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxGuests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Max Guests</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Maximum guests"
                                className="h-12 text-lg border-2 focus:border-purple-500"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="landSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Land Size</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Size of the land"
                                className="h-12 text-lg border-2 focus:border-purple-500"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="landUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-semibold">Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-lg border-2 focus:border-purple-500">
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sqm">Square Meters</SelectItem>
                                <SelectItem value="sqft">Square Feet</SelectItem>
                                <SelectItem value="acres">Acres</SelectItem>
                                <SelectItem value="hectares">Hectares</SelectItem>
                                <SelectItem value="plots">Plots</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Square Feet</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Property size in square feet"
                            className="h-12 text-lg border-2 focus:border-purple-500"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="location" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-lg font-semibold">Street Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter street address"
                              className="h-12 text-lg border-2 focus:border-purple-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">City *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter city"
                              className="h-12 text-lg border-2 focus:border-purple-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">State *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter state"
                              className="h-12 text-lg border-2 focus:border-purple-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Map Location</Label>
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg text-gray-500 font-medium">Map integration will be available here</p>
                        <p className="text-sm text-gray-400 mt-2">Interactive map for precise location selection</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Property Images (Max 10)</Label>
                    <div
                      className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                        disabled={images.length >= 10}
                      />
                      <UploadCloud className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                      <p className="text-lg text-purple-600 mb-2 font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-purple-500">PNG, JPG, WEBP up to 10MB each</p>
                      <p className="text-xs text-gray-500 mt-2">{images.length}/10 images uploaded</p>
                    </div>

                    {images.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Uploaded Images ({images.length})</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs text-center px-2 truncate">{image.name}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {amenitiesList.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                            className="border-2 border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <label
                            htmlFor={`amenity-${amenity}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Selected: {selectedAmenities.length} amenities</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center pt-8 border-t-2 border-gray-200">
                <div className="text-sm text-gray-500">
                  {currentTab === "basic" && "Step 1 of 4: Basic Information"}
                  {currentTab === "details" && "Step 2 of 4: Property Details"}
                  {currentTab === "location" && "Step 3 of 4: Location Information"}
                  {currentTab === "media" && "Step 4 of 4: Media & Amenities"}
                </div>

                <div className="flex space-x-4">
                  {currentTab !== "basic" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const tabs = ["basic", "details", "location", "media"]
                        const currentIndex = tabs.indexOf(currentTab)
                        if (currentIndex > 0) {
                          setCurrentTab(tabs[currentIndex - 1])
                        }
                      }}
                      className="px-6 py-3 border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      Previous
                    </Button>
                  )}

                  {currentTab !== "media" ? (
                    <Button
                      type="button"
                      onClick={() => {
                        const tabs = ["basic", "details", "location", "media"]
                        const currentIndex = tabs.indexOf(currentTab)
                        if (currentIndex < tabs.length - 1) {
                          setCurrentTab(tabs[currentIndex + 1])
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || createPropertyMutation.isPending}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {isSubmitting || createPropertyMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Creating Property...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Create Property
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
