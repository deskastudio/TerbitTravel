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
