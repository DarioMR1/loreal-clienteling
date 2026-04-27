import { z } from "zod";
import { STORE_CHAINS } from "../enums/store";

export const createStoreSchema = z.object({
  code: z.string().min(1).max(50),
  displayName: z.string().min(1).max(200),
  chain: z.enum(STORE_CHAINS as [string, ...string[]]),
  zoneId: z.string().uuid().optional(),
  address: z.string().max(300).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
});

export type CreateStore = z.infer<typeof createStoreSchema>;

export const updateStoreSchema = createStoreSchema.partial();

export type UpdateStore = z.infer<typeof updateStoreSchema>;
