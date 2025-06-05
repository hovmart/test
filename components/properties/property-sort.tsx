"use client"

import { useState } from "react"
import { ChevronDown, ArrowUpDown, TrendingUp, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PropertySortProps {
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  currentSort: string
  currentOrder: "asc" | "desc"
  propertyType: "buy" | "rent" | "shortlet"
}

export function PropertySort({ onSortChange, currentSort, currentOrder, propertyType }: PropertySortProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    {
      value: "featured",
      label: "Featured First",
      icon: <Star className="h-4 w-4" />,
      available: ["buy", "rent", "shortlet"],
    },
    {
      value: "price_low",
      label: propertyType === "buy" ? "Price: Low to High" : "Price: Low to High",
      icon: <TrendingUp className="h-4 w-4" />,
      available: ["buy", "rent", "shortlet"],
    },
    {
      value: "price_high",
      label: propertyType === "buy" ? "Price: High to Low" : "Price: High to Low",
      icon: <TrendingUp className="h-4 w-4 rotate-180" />,
      available: ["buy", "rent", "shortlet"],
    },
    {
      value: "newest",
      label: "Newest First",
      icon: <Calendar className="h-4 w-4" />,
      available: ["buy", "rent", "shortlet"],
    },
    {
      value: "rating",
      label: "Highest Rated",
      icon: <Star className="h-4 w-4" />,
      available: ["rent", "shortlet"],
    },
    {
      value: "popular",
      label: "Most Popular",
      icon: <TrendingUp className="h-4 w-4" />,
      available: ["buy", "rent", "shortlet"],
    },
  ]

  const availableOptions = sortOptions.filter((option) => option.available.includes(propertyType))

  const getCurrentSortLabel = () => {
    const option = availableOptions.find((opt) => {
      if (currentSort === "price") {
        return currentOrder === "asc" ? opt.value === "price_low" : opt.value === "price_high"
      }
      return opt.value === currentSort
    })
    return option?.label || "Sort by"
  }

  const handleSortSelect = (value: string) => {
    let sortBy = value
    let sortOrder: "asc" | "desc" = "desc"

    if (value === "price_low") {
      sortBy = "price"
      sortOrder = "asc"
    } else if (value === "price_high") {
      sortBy = "price"
      sortOrder = "desc"
    } else if (value === "newest") {
      sortBy = "createdAt"
      sortOrder = "desc"
    } else if (value === "rating") {
      sortBy = "rating"
      sortOrder = "desc"
    } else if (value === "popular") {
      sortBy = "views"
      sortOrder = "desc"
    } else if (value === "featured") {
      sortBy = "featured"
      sortOrder = "desc"
    }

    onSortChange(sortBy, sortOrder)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white border-gray-200 hover:border-hovmart-purple/50 transition-colors"
        >
          <ArrowUpDown className="h-4 w-4 text-hovmart-purple" />
          <span className="hidden sm:inline">{getCurrentSortLabel()}</span>
          <span className="sm:hidden">Sort</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {availableOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            className="flex items-center gap-3 cursor-pointer"
          >
            {option.icon}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
