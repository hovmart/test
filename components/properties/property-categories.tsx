"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { categories as defaultCategories } from "./property-categories-data"

interface Category {
  id: string
  name: string
  description: string
  image: string
  count: number
  featured?: boolean
}

interface PropertyCategoriesProps {
  categories?: Category[]
  activeCategory?: string
  onCategoryChange?: (category: string) => void
}

export function PropertyCategories({
  categories = defaultCategories,
  activeCategory = "all",
  onCategoryChange,
}: PropertyCategoriesProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  // Ensure categories is defined before filtering
  const categoriesData = categories || []
  const featuredCategories = categoriesData.filter((category) => category.featured)
  const regularCategories = categoriesData.filter((category) => !category.featured)

  const handleCategoryChange = (categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId)
    }
  }

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-hovmart-purple/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-hovmart-purple/10 to-transparent rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative mb-20">
          <div className="text-center relative">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-hovmart-purple tracking-wider uppercase bg-gradient-to-r from-hovmart-purple/10 to-amber-400/10 px-6 py-2 rounded-full border border-hovmart-purple/20 backdrop-blur-sm">
                Discover Your Dream Home
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
              Explore Properties by Category
            </h2>

            <div className="flex justify-center mb-8">
              <div className="w-24 h-1.5 bg-gradient-to-r from-hovmart-purple via-amber-400 to-hovmart-purple rounded-full shadow-lg"></div>
            </div>

            <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed font-light">
              Discover your perfect property from our diverse range of categories, each offering unique experiences and
              amenities tailored to your refined preferences.
            </p>
          </div>
        </div>

        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {featuredCategories.map((category, index) => (
              <FeaturedCategoryCard
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                isHovered={hoveredCategory === category.id}
                onHover={() => setHoveredCategory(category.id)}
                onLeave={() => setHoveredCategory(null)}
                onClick={() => handleCategoryChange(category.id)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Regular Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {regularCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              isHovered={hoveredCategory === category.id}
              onHover={() => setHoveredCategory(category.id)}
              onLeave={() => setHoveredCategory(null)}
              onClick={() => handleCategoryChange(category.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description: string
    image: string
    count: number
    featured?: boolean
  }
  isActive: boolean
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
  index: number
}

function CategoryCard({ category, isActive, isHovered, onHover, onLeave, onClick, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className={`group ${isActive ? "ring-2 ring-hovmart-purple/50 ring-offset-4" : ""}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link
        href={`/properties?category=${category.id}`}
        className="block h-full"
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 h-full group-hover:border-hovmart-purple/30 group-hover:-translate-y-2">
          <div className="relative aspect-[3/2] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-hovmart-purple/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">{category.name}</h3>
              <div className="flex items-center text-white/90 text-sm font-medium">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{category.count} properties</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">{category.description}</p>
            <div className="flex items-center text-hovmart-purple font-semibold text-sm group-hover:text-amber-600 transition-colors duration-300">
              <span>Explore properties</span>
              <ChevronRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function FeaturedCategoryCard({ category, isActive, isHovered, onHover, onLeave, onClick, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className={`group ${isActive ? "ring-2 ring-hovmart-purple/50 ring-offset-4" : ""}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link
        href={`/properties?category=${category.id}`}
        className="block h-full"
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 h-full relative group-hover:border-hovmart-purple/30 group-hover:-translate-y-1">
          <div className="absolute top-6 left-6 z-30 bg-gradient-to-r from-hovmart-purple to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            Featured
          </div>
          <div className="md:flex h-full">
            <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-hovmart-purple/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <h3 className="text-gray-900 text-2xl font-bold mb-3 group-hover:text-hovmart-purple transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {category.count} properties available
                </span>
              </div>
              <div className="inline-flex items-center text-hovmart-purple font-bold group-hover:text-amber-600 transition-colors duration-300">
                <span>View all properties</span>
                <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
