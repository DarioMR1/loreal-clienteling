import { z } from "zod";
import { COMMUNICATION_CHANNELS } from "../enums/communication";
import { FOLLOWUP_TYPES } from "../enums/communication";

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  brandId: z.string().uuid().optional(),
  channel: z.enum(COMMUNICATION_CHANNELS as [string, ...string[]]),
  followupType: z.enum(FOLLOWUP_TYPES as [string, ...string[]]),
  body: z.string().min(1).max(5000),
});

export type CreateTemplate = z.infer<typeof createTemplateSchema>;

export const updateTemplateSchema = createTemplateSchema.partial();

export type UpdateTemplate = z.infer<typeof updateTemplateSchema>;
