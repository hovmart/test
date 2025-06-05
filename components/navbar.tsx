"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Building2,
  Users,
  Mail,
  LayoutDashboard,
  Search,
  User,
  Calendar,
  Bell,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth, useUser, UserButton } from "@clerk/nextjs"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchActive, setSearchActive] = useState(false)
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()

  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus search input when search is activated
  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchActive])

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path))

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? "bg-white/95 backdrop-blur-2xl shadow-[0_1px_40px_rgba(75,0,130,0.08)] border-b border-hovmart-purple/5"
          : "bg-white/80 backdrop-blur-xl"
      }`}
      ref={navRef}
    >
      {/* Elegant top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-hovmart-purple/30 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center group z-10">
            <div className="relative">
              <Image
                src="/hovmart-logo.png"
                alt="Hovmart"
                width={140}
                height={32}
                className="h-7 lg:h-8 w-auto transition-all duration-500 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-hovmart-purple to-hovmart-light group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Search */}
            <AnimatePresence mode="wait">
              {searchActive ? (
                <motion.div
                  initial={{ opacity: 0, width: 40 }}
                  animate={{ opacity: 1, width: 280 }}
                  exit={{ opacity: 0, width: 40 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="relative mr-6"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search luxury properties..."
                    className="w-full h-10 pl-11 pr-4 rounded-full bg-gray-50/80 border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 focus:border-hovmart-purple/30 text-sm placeholder:text-gray-400 transition-all duration-300"
                    onBlur={() => setSearchActive(false)}
                  />
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSearchActive(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50/80 transition-all duration-300 mr-4 group"
                  aria-label="Search"
                >
                  <Search
                    size={18}
                    className="text-gray-500 group-hover:text-hovmart-purple transition-colors duration-300"
                  />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Properties Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("properties")}
                className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 ${
                  isActive("/properties")
                    ? "text-hovmart-purple bg-hovmart-purple/8 shadow-sm"
                    : "text-gray-700 hover:text-hovmart-purple hover:bg-gray-50/80"
                }`}
                aria-expanded={activeDropdown === "properties"}
              >
                <span className="font-medium">Properties</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${activeDropdown === "properties" ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "properties" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-72"
                  >
                    <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-12px_rgba(75,0,130,0.15)] p-2 border border-gray-100/80 overflow-hidden">
                      {/* Subtle top accent */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-hovmart-purple/20 to-transparent"></div>

                      <div className="space-y-1 py-2">
                        {/* Property Categories */}
                        <div className="px-3 py-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Categories
                          </h4>
                          <div className="space-y-1">
                            <DropdownLink
                              href="/properties/buy"
                              label="Buy Properties"
                              icon={<Building2 size={15} />}
                              isActive={pathname === "/properties/buy"}
                              onClick={() => setActiveDropdown(null)}
                            />
                            <DropdownLink
                              href="/properties/rent"
                              label="Rent Properties"
                              icon={<Building2 size={15} />}
                              isActive={pathname === "/properties/rent"}
                              onClick={() => setActiveDropdown(null)}
                            />
                            <DropdownLink
                              href="/properties/shortlet"
                              label="Shortlet Properties"
                              icon={<Building2 size={15} />}
                              isActive={pathname === "/properties/shortlet"}
                              onClick={() => setActiveDropdown(null)}
                            />
                          </div>
                        </div>

                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Other Options */}
                        <div className="space-y-1">
                          <DropdownLink
                            href="/properties"
                            label="All Properties"
                            icon={<Building2 size={15} />}
                            isActive={
                              pathname === "/properties" && !new URLSearchParams(window.location.search).get("category")
                            }
                            onClick={() => setActiveDropdown(null)}
                          />
                          <DropdownLink
                            href="/properties/collections"
                            label="Featured Collections"
                            icon={<Building2 size={15} />}
                            isActive={pathname === "/properties/collections"}
                            onClick={() => setActiveDropdown(null)}
                          />
                          <DropdownLink
                            href="/properties/compare"
                            label="Compare Properties"
                            icon={<Building2 size={15} />}
                            isActive={pathname === "/properties/compare"}
                            onClick={() => setActiveDropdown(null)}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/about" label="About" />
            <NavLink href="/contact" label="Contact" />

            {isSignedIn && <NavLink href="/dashboard" label="Dashboard" />}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isLoaded ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-hovmart-purple border-t-transparent"></div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-50/80 transition-all duration-300">
                  <Bell size={18} className="text-gray-600" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-hovmart-purple">3</Badge>
                </button>

                {/* User Button from Clerk */}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-10 h-10 ring-2 ring-hovmart-purple/20 hover:ring-hovmart-purple/40 transition-all duration-300",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-hovmart-purple to-hovmart-light hover:shadow-lg hover:shadow-hovmart-purple/25 hover:scale-[1.02] transition-all duration-300"
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 group-hover:bg-hovmart-purple/10 transition-all duration-300">
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={18} className="text-hovmart-purple" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={18} className="text-hovmart-purple" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-gray-100/80 overflow-hidden"
          >
            {/* Mobile search */}
            <div className="container mx-auto px-4 sm:px-6 pt-4 pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-gray-50/80 border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-hovmart-purple/20 text-sm"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <nav className="container mx-auto px-4 sm:px-6 py-6">
              <div className="space-y-6">
                <MobileNavLink href="/" label="Home" icon={<Home size={16} />} isActive={pathname === "/"} />

                <div>
                  <button
                    onClick={() => toggleDropdown("mobileProperties")}
                    className={`flex items-center justify-between w-full text-base font-medium transition-colors ${
                      isActive("/properties") ? "text-hovmart-purple" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-hovmart-purple" />
                      <span>Properties</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${
                        activeDropdown === "mobileProperties" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === "mobileProperties" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pl-8 border-l border-hovmart-purple/20 ml-2"
                      >
                        <div className="space-y-4 py-1">
                          <MobileSubLink
                            href="/properties/buy"
                            label="Buy Properties"
                            isActive={pathname === "/properties/buy"}
                          />
                          <MobileSubLink
                            href="/properties/rent"
                            label="Rent Properties"
                            isActive={pathname === "/properties/rent"}
                          />
                          <MobileSubLink
                            href="/properties/shortlet"
                            label="Shortlet Properties"
                            isActive={pathname === "/properties/shortlet"}
                          />
                          <MobileSubLink
                            href="/properties"
                            label="All Properties"
                            isActive={
                              pathname === "/properties" && !new URLSearchParams(window.location.search).get("category")
                            }
                          />
                          <MobileSubLink
                            href="/properties/collections"
                            label="Featured Collections"
                            isActive={pathname === "/properties/collections"}
                          />
                          <MobileSubLink
                            href="/properties/compare"
                            label="Compare Properties"
                            isActive={pathname === "/properties/compare"}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <MobileNavLink
                  href="/about"
                  label="About"
                  icon={<Users size={16} />}
                  isActive={pathname === "/about"}
                />
                <MobileNavLink
                  href="/contact"
                  label="Contact"
                  icon={<Mail size={16} />}
                  isActive={pathname === "/contact"}
                />

                {isSignedIn && (
                  <>
                    <MobileNavLink
                      href="/dashboard"
                      label="Dashboard"
                      icon={<LayoutDashboard size={16} />}
                      isActive={pathname === "/dashboard"}
                    />
                    <MobileNavLink
                      href="/profile"
                      label="Profile"
                      icon={<User size={16} />}
                      isActive={pathname === "/profile"}
                    />
                    <MobileNavLink
                      href="/bookings"
                      label="My Bookings"
                      icon={<Calendar size={16} />}
                      isActive={pathname === "/bookings"}
                    />
                  </>
                )}

                {/* Mobile Auth Buttons */}
                {!isSignedIn && (
                  <div className="pt-4 space-y-3">
                    <Link href="/sign-in" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-hovmart-purple text-hovmart-purple hover:bg-hovmart-purple hover:text-white"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="block">
                      <Button className="w-full bg-gradient-to-r from-hovmart-purple to-hovmart-light text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}

                {isSignedIn && (
                  <div className="pt-4">
                    <div className="flex justify-center">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-12 h-12",
                          },
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
        isActive
          ? "text-hovmart-purple bg-hovmart-purple/8 shadow-sm"
          : "text-gray-700 hover:text-hovmart-purple hover:bg-gray-50/80"
      }`}
    >
      <span>{label}</span>
    </Link>
  )
}

function DropdownLink({
  href,
  label,
  icon,
  isActive,
  onClick,
}: {
  href: string
  label: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-hovmart-purple/8 text-hovmart-purple"
          : "text-gray-700 hover:bg-gray-50/80 hover:text-hovmart-purple"
      }`}
      onClick={onClick}
    >
      <span
        className={`${
          isActive ? "text-hovmart-purple" : "text-gray-400 group-hover:text-hovmart-purple"
        } transition-colors duration-200`}
      >
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

function MobileNavLink({
  href,
  label,
  icon,
  isActive,
}: {
  href: string
  label: string
  icon: React.ReactNode
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 py-2 transition-colors duration-200 ${
        isActive ? "text-hovmart-purple" : "text-gray-700 hover:text-hovmart-purple"
      }`}
    >
      <span className={`${isActive ? "text-hovmart-purple" : "text-gray-400"} transition-colors duration-200`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  )
}

function MobileSubLink({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={`block transition-colors duration-200 ${
        isActive ? "text-hovmart-purple" : "text-gray-600 hover:text-hovmart-purple"
      }`}
    >
      <span className="text-sm">{label}</span>
    </Link>
  )
}
