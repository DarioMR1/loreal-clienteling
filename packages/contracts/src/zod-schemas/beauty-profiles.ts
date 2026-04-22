import { z } from "zod";
import {
  SKIN_TYPES,
  SKIN_TONES,
  SKIN_SUBTONES,
  SKIN_CONCERNS,
  FRAGRANCE_PREFERENCES,
  ROUTINE_TYPES,
  BEAUTY_INTERESTS,
  SHADE_CATEGORIES,
} from "../enums/beauty";

export const upsertBeautyProfileSchema = z.object({
  customerId: z.string().uuid(),
  skinType: z.enum(SKIN_TYPES as [string, ...string[]]).optional(),
  skinTone: z.enum(SKIN_TONES as [string, ...string[]]).optional(),
  skinSubtone: z.enum(SKIN_SUBTONES as [string, ...string[]]).optional(),
  skinConcerns: z
    .array(z.enum(SKIN_CONCERNS as [string, ...string[]]))
    .optional(),
  preferredIngredients: z.array(z.string()).optional(),
  avoidedIngredients: z.array(z.string()).optional(),
  fragrancePreferences: z
    .array(z.enum(FRAGRANCE_PREFERENCES as [string, ...string[]]))
    .optional(),
  makeupPreferences: z.record(z.unknown()).optional(),
  routineType: z.enum(ROUTINE_TYPES as [string, ...string[]]).optional(),
  interests: z
    .array(z.enum(BEAUTY_INTERESTS as [string, ...string[]]))
    .optional(),
});

export type UpsertBeautyProfile = z.infer<typeof upsertBeautyProfileSchema>;

export const createShadeSchema = z.object({
  beautyProfileId: z.string().uuid(),
  category: z.enum(SHADE_CATEGORIES as [string, ...string[]]),
  brandId: z.string().uuid(),
  productId: z.string().uuid(),
  shadeCode: z.string().min(1).max(50),
});

export type CreateShade = z.infer<typeof createShadeSchema>;
