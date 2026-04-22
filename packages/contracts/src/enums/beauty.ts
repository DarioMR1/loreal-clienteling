export const SkinType = {
  DRY: "dry",
  OILY: "oily",
  COMBINATION: "combination",
  SENSITIVE: "sensitive",
  NORMAL: "normal",
} as const;

export type SkinType = (typeof SkinType)[keyof typeof SkinType];

export const SKIN_TYPES = Object.values(SkinType);

export const SkinTone = {
  FAIR: "fair",
  LIGHT: "light",
  MEDIUM: "medium",
  TAN: "tan",
  DEEP: "deep",
} as const;

export type SkinTone = (typeof SkinTone)[keyof typeof SkinTone];

export const SKIN_TONES = Object.values(SkinTone);

export const SkinSubtone = {
  COOL: "cool",
  NEUTRAL: "neutral",
  WARM: "warm",
} as const;

export type SkinSubtone = (typeof SkinSubtone)[keyof typeof SkinSubtone];

export const SKIN_SUBTONES = Object.values(SkinSubtone);

export const SkinConcern = {
  ACNE: "acne",
  AGING: "aging",
  PIGMENTATION: "pigmentation",
  DRYNESS: "dryness",
  SENSITIVITY: "sensitivity",
  PORES: "pores",
  DARK_CIRCLES: "dark_circles",
  REDNESS: "redness",
} as const;

export type SkinConcern = (typeof SkinConcern)[keyof typeof SkinConcern];

export const SKIN_CONCERNS = Object.values(SkinConcern);

export const FragrancePreference = {
  FLORAL: "floral",
  WOODY: "woody",
  CITRUS: "citrus",
  ORIENTAL: "oriental",
  FRESH: "fresh",
  GOURMAND: "gourmand",
} as const;

export type FragrancePreference =
  (typeof FragrancePreference)[keyof typeof FragrancePreference];

export const FRAGRANCE_PREFERENCES = Object.values(FragrancePreference);

export const RoutineType = {
  MORNING: "morning",
  NIGHT: "night",
  BOTH: "both",
} as const;

export type RoutineType = (typeof RoutineType)[keyof typeof RoutineType];

export const ROUTINE_TYPES = Object.values(RoutineType);

export const BeautyInterest = {
  SKINCARE: "skincare",
  MAKEUP: "makeup",
  FRAGRANCE: "fragrance",
} as const;

export type BeautyInterest =
  (typeof BeautyInterest)[keyof typeof BeautyInterest];

export const BEAUTY_INTERESTS = Object.values(BeautyInterest);

export const ShadeCategory = {
  FOUNDATION: "foundation",
  CONCEALER: "concealer",
  LIPSTICK: "lipstick",
  BLUSH: "blush",
} as const;

export type ShadeCategory = (typeof ShadeCategory)[keyof typeof ShadeCategory];

export const SHADE_CATEGORIES = Object.values(ShadeCategory);
