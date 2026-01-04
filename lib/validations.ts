import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(5, "Description is too short"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  // We will handle images as an array of strings (URLs)
  images: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;