import * as z from "zod";

// Functional component not required for schema, but here's the updated structure
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

const forgotPasswordSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
  })

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export { loginSchema };
export { forgotPasswordSchema };

export const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(10, "Phone number must be at least 10 digits"),
  agency: z.string().min(2, "Agency name must be at least 2 characters"),
  tourPackage: z.string().min(2, "Tour package must be at least 2 characters"),
  dateRange: z.string().min(1, "Date range is required"),
  numberOfParticipants: z.number().min(1, "Number of participants must be at least 1"),
  busCapacity: z.number().min(1, "Bus capacity must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
  noKtp: z.string().min(16, "KTP number must be 16 digits").max(16, "KTP number must be 16 digits"),
})

export type BookingFormValues = z.infer<typeof bookingFormSchema>

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type PasswordFormValues = z.infer<typeof passwordSchema>

export const tourPackageSchema = z.object({
  name: z.string().min(3, "Nama paket harus memiliki minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi harus memiliki minimal 10 karakter"),
  includes: z.array(z.string().nonempty("Item tidak boleh kosong")).min(1, "Tambahkan minimal 1 item"),
  excludes: z.array(z.string().nonempty("Item tidak boleh kosong")),
  schedules: z
    .array(
      z.object({
        startDate: z.string().nonempty("Tanggal mulai harus diisi"),
        endDate: z.string().nonempty("Tanggal pulang harus diisi"),
      })
    )
    .min(1, "Tambahkan minimal 1 jadwal perjalanan"),
  price: z.number().min(0, "Harga harus berupa angka dan tidak boleh negatif"),
  duration: z.string().nonempty("Durasi harus diisi"),
  destination: z.string().nonempty("Pilih destinasi"),
  hotel: z.string().nonempty("Pilih hotel"),
  fleet: z.string().nonempty("Pilih transportasi"),
  consume: z.enum(
    ["breakfast", "full_board", "none"], 
    { 
      errorMap: () => ({ message: "Pilih opsi konsumsi" })
    }
  ),
  status: z.enum(
    [
      "available",
      "booked",
      "in_progress",
      "completed",
      "cancelled",
      "pending_review",
      "archived",
      "draft",
    ],
    { 
      errorMap: () => ({ message: "Pilih status yang valid" })
    }
  ),
});

// Tipe TypeScript untuk form menggunakan Zod
export type TourPackage = z.infer<typeof tourPackageSchema>;
