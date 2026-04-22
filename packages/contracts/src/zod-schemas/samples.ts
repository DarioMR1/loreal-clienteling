import { z } from "zod";

export const createSampleSchema = z.object({
  customerId: z.string().uuid(),
  productId: z.string().uuid(),
});

export type CreateSample = z.infer<typeof createSampleSchema>;
