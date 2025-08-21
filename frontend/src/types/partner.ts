import { z } from 'zod';

export const partnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Invalid image URL"),
  status: z.enum(['active', 'inactive']),
});

export type Partner = z.infer<typeof partnerSchema>;

