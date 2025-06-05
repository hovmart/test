"use client"

import { Grid3X3, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  currentView: "grid" | "list" | "map"
  onViewChange: (view: "grid" | "list" | "map") => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("grid")}
        className={cn(
          "h-8 px-3 rounded-md transition-all",
          currentView === "grid"
            ? "bg-white shadow-sm text-hovmart-purple"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        )}
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Grid</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("list")}
        className={cn(
          "h-8 px-3 rounded-md transition-all",
          currentView === "list"
            ? "bg-white shadow-sm text-hovmart-purple"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        )}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">List</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("map")}
        className={cn(
          "h-8 px-3 rounded-md transition-all",
          currentView === "map"
            ? "bg-white shadow-sm text-hovmart-purple"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
        )}
      >
        <Map className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Map</span>
      </Button>
    </div>
  )
}
