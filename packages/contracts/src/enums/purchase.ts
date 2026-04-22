export const PurchaseSource = {
  POS_INTEGRATION: "pos_integration",
  MANUAL: "manual",
  ECOMMERCE: "ecommerce",
} as const;

export type PurchaseSource =
  (typeof PurchaseSource)[keyof typeof PurchaseSource];

export const PURCHASE_SOURCES = Object.values(PurchaseSource);

export const AttributionReason = {
  LAST_CONSULTATION: "last_consultation",
  ACTIVE_RECOMMENDATION: "active_recommendation",
  DIRECT_ASSISTANCE: "direct_assistance",
} as const;

export type AttributionReason =
  (typeof AttributionReason)[keyof typeof AttributionReason];

export const ATTRIBUTION_REASONS = Object.values(AttributionReason);
