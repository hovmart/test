/*const AuthContext = createContext<{
  user: User | null
  loading: boolean
  signIn: (email: string, password?: string) => Promise<void>
  signUp: (email: string, password?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; data?: any; error?: string }>
  isUpdatingProfile: boolean
}>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => ({ success: false }),
  isUpdatingProfile: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  useEffect(() => {
    const loadUserFromCookies = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const res = await fetch("/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (res.ok) {
            const userData = await res.json()
            setUser(userData)
          }
        }
      } catch (error) {
        console.error("Error loading user from cookies:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromCookies()
  }, [])

  const signIn = async (email: string, password?: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        await router.push("/dashboard")
      } else {
        console.error("Login failed:", data.message)
        // Handle login error (e.g., display error message)
      }
    } catch (error) {
      console.error("Login error:", error)
      // Handle login error (e.g., display error message)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password?: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        await router.push("/dashboard")
      } else {
        console.error("Registration failed:", data.message)
        // Handle registration error (e.g., display error message)
      }
    } catch (error) {
      console.error("Registration error:", error)
      // Handle registration error (e.g., display error message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      localStorage.removeItem("token")
      setUser(null)
      await router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) {
      return { success: false, error: "No user logged in" }
    }

    setIsUpdatingProfile(true)

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          updates,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      // Update local user state
      setUser(data)

      return { success: true, data }
    } catch (error) {
      console.error("Profile update error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update profile",
      }
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isUpdatingProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}*/

"use client"

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs"

export function useAuth() {
  const { isSignedIn, isLoaded } = useClerkAuth()
  const { user } = useUser()

  return {
    user: user
      ? {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          name: user.fullName || user.firstName || "",
          avatar: user.imageUrl || "",
        }
      : null,
    isSignedIn,
    isLoaded,
    loading: !isLoaded,
  }
}
