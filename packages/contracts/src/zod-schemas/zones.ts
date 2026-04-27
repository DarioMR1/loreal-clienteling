import { z } from "zod";

export const createZoneSchema = z.object({
  code: z.string().min(1).max(50),
  displayName: z.string().min(1).max(200),
  region: z.string().max(200).optional(),
});

export type CreateZone = z.infer<typeof createZoneSchema>;

export const updateZoneSchema = createZoneSchema.partial();

export type UpdateZone = z.infer<typeof updateZoneSchema>;
