import { z } from "zod";
import { BRAND_TIERS } from "@loreal/contracts";

export const createBrandSchema = z.object({
  code: z.string().min(1).max(50),
  displayName: z.string().min(1).max(200),
  tier: z.enum(BRAND_TIERS as [string, ...string[]]),
});

export const updateBrandSchema = createBrandSchema.partial();
