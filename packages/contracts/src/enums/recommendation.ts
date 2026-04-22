export const RecommendationSource = {
  MANUAL: "manual",
  AI_SUGGESTED: "ai_suggested",
  REPLENISHMENT_ALERT: "replenishment_alert",
} as const;

export type RecommendationSource =
  (typeof RecommendationSource)[keyof typeof RecommendationSource];

export const RECOMMENDATION_SOURCES = Object.values(RecommendationSource);

export const VisitReason = {
  NEW_PURCHASE: "new_purchase",
  REBUY: "rebuy",
  GIFT: "gift",
  CONCERN: "concern",
  PROMOTION: "promotion",
  BROWSING: "browsing",
} as const;

export type VisitReason = (typeof VisitReason)[keyof typeof VisitReason];

export const VISIT_REASONS = Object.values(VisitReason);
