import { z } from "zod";
import { CONSENT_TYPES } from "../enums/consent";

export const grantConsentSchema = z.object({
  customerId: z.string().uuid(),
  type: z.enum(CONSENT_TYPES as [string, ...string[]]),
  version: z.string().min(1).max(20),
  source: z.string().max(100),
});

export type GrantConsent = z.infer<typeof grantConsentSchema>;

export const revokeConsentSchema = z.object({
  customerId: z.string().uuid(),
  type: z.enum(CONSENT_TYPES as [string, ...string[]]),
});

export type RevokeConsent = z.infer<typeof revokeConsentSchema>;
