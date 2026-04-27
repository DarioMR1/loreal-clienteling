import { z } from "zod";
import { PRODUCT_CATEGORIES } from "../enums/product";

export const createProductSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  brandId: z.string().uuid(),
  category: z.enum(PRODUCT_CATEGORIES as [string, ...string[]]),
  subcategory: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  price: z.coerce.number().positive(),
  estimatedDurationDays: z.coerce.number().int().positive().optional(),
});

export type CreateProduct = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export type UpdateProduct = z.infer<typeof updateProductSchema>;
