import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
});

export const galleryItemSchema = z.object({
  id: z.string(),
  image: z.instanceof(File, { message: "Image is required" }),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: categorySchema,
});

export type Category = z.infer<typeof categorySchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;

