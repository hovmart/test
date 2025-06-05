import { z } from "zod"

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      return /^\+?[\d\s\-()]+$/.test(val)
    }, "Please enter a valid phone number"),
  address: z.string().max(500, "Address must be less than 500 characters").optional(),
  date_of_birth: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      const date = new Date(val)
      const now = new Date()
      const age = now.getFullYear() - date.getFullYear()
      return age >= 13 && age <= 120
    }, "Please enter a valid date of birth"),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
})

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>
