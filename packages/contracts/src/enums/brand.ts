export const BrandTier = {
  LUXURY: "luxury",
  PREMIUM: "premium",
  MASS: "mass",
} as const;

export type BrandTier = (typeof BrandTier)[keyof typeof BrandTier];

export const BRAND_TIERS = Object.values(BrandTier);
