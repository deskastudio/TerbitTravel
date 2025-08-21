import { z } from 'zod';

export const companyInfoSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters long"),
  vision: z.string().min(10, "Vision must be at least 10 characters long"),
  mission: z.string().min(10, "Mission must be at least 10 characters long"),
});

export type CompanyInfo = z.infer<typeof companyInfoSchema>;

