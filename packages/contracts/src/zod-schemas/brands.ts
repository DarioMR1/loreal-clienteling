import { z } from "zod";
import { BRAND_TIERS } from "../enums/brand";

export const createBrandSchema = z.object({
  code: z.string().min(1).max(50),
  displayName: z.string().min(1).max(200),
  tier: z.enum(BRAND_TIERS as [string, ...string[]]),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;

export const updateBrandSchema = createBrandSchema.partial();

export type UpdateBrand = z.infer<typeof updateBrandSchema>;
