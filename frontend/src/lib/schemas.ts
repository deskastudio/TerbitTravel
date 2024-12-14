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
