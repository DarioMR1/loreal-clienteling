import { z } from "zod";
import { COMMUNICATION_CHANNELS, FOLLOWUP_TYPES } from "../enums/communication";

export const createCommunicationSchema = z.object({
  customerId: z.string().uuid(),
  channel: z.enum(COMMUNICATION_CHANNELS as [string, ...string[]]),
  templateId: z.string().uuid().optional(),
  subject: z.string().max(200).optional(),
  body: z.string().min(1).max(5000),
  followupType: z.enum(FOLLOWUP_TYPES as [string, ...string[]]),
});

export type CreateCommunication = z.infer<typeof createCommunicationSchema>;
