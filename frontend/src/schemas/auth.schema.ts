// import * as z from "zod";

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

// export const registerSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   password: z.string().min(8),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// export type LoginFormValues = z.infer<typeof loginSchema>;
// export type RegisterFormValues = z.infer<typeof registerSchema>;