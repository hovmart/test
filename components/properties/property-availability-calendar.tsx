"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyAvailabilityCalendarProps {
  availableDates: string[]
  selectedCheckIn?: string
  selectedCheckOut?: string
  onDateSelect: (date: string, type: "checkin" | "checkout") => void
  minNights?: number
}

export function PropertyAvailabilityCalendar({
  availableDates,
  selectedCheckIn,
  selectedCheckOut,
  onDateSelect,
  minNights = 1,
}: PropertyAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectingType, setSelectingType] = useState<"checkin" | "checkout">("checkin")

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [currentMonth])

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return availableDates.includes(dateString) && date >= today
  }

  const isDateSelected = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return dateString === selectedCheckIn || dateString === selectedCheckOut
  }

  const isDateInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false
    const dateString = date.toISOString().split("T")[0]
    return dateString > selectedCheckIn && dateString < selectedCheckOut
  }

  const isDateDisabled = (date: Date) => {
    if (!isDateAvailable(date)) return true

    if (selectingType === "checkout" && selectedCheckIn) {
      const checkInDate = new Date(selectedCheckIn)
      const minCheckoutDate = new Date(checkInDate)
      minCheckoutDate.setDate(checkInDate.getDate() + minNights)
      return date < minCheckoutDate
    }

    return false
  }

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return

    const dateString = date.toISOString().split("T")[0]

    if (selectingType === "checkin") {
      onDateSelect(dateString, "checkin")
      setSelectingType("checkout")
    } else {
      onDateSelect(dateString, "checkout")
      setSelectingType("checkin")
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const getDateClasses = (date: Date) => {
    const baseClasses =
      "w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 cursor-pointer"

    if (isDateDisabled(date)) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`
    }

    if (isDateSelected(date)) {
      return `${baseClasses} bg-hovmart-purple text-white font-semibold`
    }

    if (isDateInRange(date)) {
      return `${baseClasses} bg-hovmart-purple/20 text-hovmart-purple`
    }

    if (isDateAvailable(date)) {
      return `${baseClasses} hover:bg-hovmart-purple/10 hover:text-hovmart-purple`
    }

    return `${baseClasses} text-gray-300 cursor-not-allowed`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth("prev")} className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h3 className="font-semibold text-lg">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <Button variant="ghost" size="icon" onClick={() => navigateMonth("next")} className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Selection indicator */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          {selectingType === "checkin" ? "Select check-in date" : "Select check-out date"}
        </p>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <div className={getDateClasses(date)} onClick={() => handleDateClick(date)}>
                {date.getDate()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-hovmart-purple rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-hovmart-purple/20 rounded"></div>
          <span>In range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}
