import type { AttributionReason } from "@loreal/contracts";

export interface RecommendationRecord {
  baUserId: string;
  productId: string;
  recommendedAt: Date;
  recommendationId: string;
}

export interface AttributionInput {
  customerId: string;
  purchasedProductIds: string[];
  purchasedAt: Date;
  lastBaUserId: string | null;
  lastContactAt: Date | null;
  activeRecommendations: RecommendationRecord[];
  now?: Date;
}

export interface AttributionResult {
  attributedBaUserId: string | null;
  attributionReason: AttributionReason | null;
  matchedRecommendationId: string | null;
}

const DAYS_MS = 24 * 60 * 60 * 1000;
const RECOMMENDATION_WINDOW_DAYS = 30;
const CONSULTATION_WINDOW_HOURS = 24;

/**
 * RF-25: Atribución de venta al BA.
 *
 * Reglas en orden de prioridad:
 * 1. Si existe una Recommendation activa (últimos 30 días) del mismo producto → BA que recomendó
 * 2. Si hubo consulta (last_ba_user_id) en las últimas 24 horas → ese BA
 * 3. Sin atribución
 */
export function attributePurchaseToBa(
  input: AttributionInput,
): AttributionResult {
  const now = input.now ?? new Date();
  const purchaseTime = input.purchasedAt;

  // Rule 1: Active recommendation within 30 days for one of the purchased products
  const windowStart = new Date(
    purchaseTime.getTime() - RECOMMENDATION_WINDOW_DAYS * DAYS_MS,
  );

  const matchingRecommendation = input.activeRecommendations
    .filter(
      (r) =>
        input.purchasedProductIds.includes(r.productId) &&
        r.recommendedAt >= windowStart &&
        r.recommendedAt <= purchaseTime,
    )
    .sort((a, b) => b.recommendedAt.getTime() - a.recommendedAt.getTime())[0];

  if (matchingRecommendation) {
    return {
      attributedBaUserId: matchingRecommendation.baUserId,
      attributionReason: "active_recommendation",
      matchedRecommendationId: matchingRecommendation.recommendationId,
    };
  }

  // Rule 2: Last consultation within 24 hours
  if (input.lastBaUserId && input.lastContactAt) {
    const hoursSinceContact =
      (purchaseTime.getTime() - input.lastContactAt.getTime()) /
      (DAYS_MS / 24);

    if (
      hoursSinceContact >= 0 &&
      hoursSinceContact <= CONSULTATION_WINDOW_HOURS
    ) {
      return {
        attributedBaUserId: input.lastBaUserId,
        attributionReason: "last_consultation",
        matchedRecommendationId: null,
      };
    }
  }

  // Rule 3: No attribution
  return {
    attributedBaUserId: null,
    attributionReason: null,
    matchedRecommendationId: null,
  };
}
