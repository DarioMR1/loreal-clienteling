import {
  attributePurchaseToBa,
  AttributionInput,
} from "./attribute-purchase-to-ba";

const BASE_DATE = new Date("2026-04-21T14:00:00Z");

function makeInput(overrides: Partial<AttributionInput>): AttributionInput {
  return {
    customerId: "customer-1",
    purchasedProductIds: ["product-1"],
    purchasedAt: BASE_DATE,
    lastBaUserId: null,
    lastContactAt: null,
    activeRecommendations: [],
    now: BASE_DATE,
    ...overrides,
  };
}

describe("attributePurchaseToBa", () => {
  describe("Rule 1: active recommendation within 30 days", () => {
    it("attributes to BA who recommended the purchased product", () => {
      const result = attributePurchaseToBa(
        makeInput({
          activeRecommendations: [
            {
              baUserId: "ba-1",
              productId: "product-1",
              recommendedAt: new Date("2026-04-10T10:00:00Z"),
              recommendationId: "rec-1",
            },
          ],
        }),
      );

      expect(result.attributedBaUserId).toBe("ba-1");
      expect(result.attributionReason).toBe("active_recommendation");
      expect(result.matchedRecommendationId).toBe("rec-1");
    });

    it("ignores recommendations older than 30 days", () => {
      const result = attributePurchaseToBa(
        makeInput({
          activeRecommendations: [
            {
              baUserId: "ba-1",
              productId: "product-1",
              recommendedAt: new Date("2026-03-01T10:00:00Z"),
              recommendationId: "rec-1",
            },
          ],
        }),
      );

      expect(result.attributedBaUserId).toBeNull();
    });

    it("ignores recommendations for different products", () => {
      const result = attributePurchaseToBa(
        makeInput({
          activeRecommendations: [
            {
              baUserId: "ba-1",
              productId: "other-product",
              recommendedAt: new Date("2026-04-15T10:00:00Z"),
              recommendationId: "rec-1",
            },
          ],
        }),
      );

      expect(result.attributedBaUserId).toBeNull();
    });

    it("picks the most recent recommendation when multiple match", () => {
      const result = attributePurchaseToBa(
        makeInput({
          activeRecommendations: [
            {
              baUserId: "ba-1",
              productId: "product-1",
              recommendedAt: new Date("2026-04-05T10:00:00Z"),
              recommendationId: "rec-1",
            },
            {
              baUserId: "ba-2",
              productId: "product-1",
              recommendedAt: new Date("2026-04-18T10:00:00Z"),
              recommendationId: "rec-2",
            },
          ],
        }),
      );

      expect(result.attributedBaUserId).toBe("ba-2");
      expect(result.matchedRecommendationId).toBe("rec-2");
    });

    it("matches any of the purchased products", () => {
      const result = attributePurchaseToBa(
        makeInput({
          purchasedProductIds: ["product-1", "product-2", "product-3"],
          activeRecommendations: [
            {
              baUserId: "ba-1",
              productId: "product-3",
              recommendedAt: new Date("2026-04-15T10:00:00Z"),
              recommendationId: "rec-1",
            },
          ],
        }),
      );

      expect(result.attributedBaUserId).toBe("ba-1");
    });
  });

  describe("Rule 2: last consultation within 24 hours", () => {
    it("attributes to last BA when contact was within 24h", () => {
      const result = attributePurchaseToBa(
        makeInput({
          lastBaUserId: "ba-3",
          lastContactAt: new Date("2026-04-21T06:00:00Z"),
        }),
      );

      expect(result.attributedBaUserId).toBe("ba-3");
      expect(result.attributionReason).toBe("last_consultation");
      expect(result.matchedRecommendationId).toBeNull();
    });

    it("does not attribute if contact was more than 24h ago", () => {
      const result = attributePurchaseToBa(
        makeInput({
          lastBaUserId: "ba-3",
          lastContactAt: new Date("2026-04-19T10:00:00Z"),
        }),
      );

      expect(result.attributedBaUserId).toBeNull();
    });

    it("does not attribute if lastBaUserId is null", () => {
      const result = attributePurchaseToBa(
        makeInput({
          lastBaUserId: null,
          lastContactAt: new Date("2026-04-21T06:00:00Z"),
        }),
      );

      expect(result.attributedBaUserId).toBeNull();
    });
  });

  describe("priority: recommendation > consultation", () => {
    it("prefers active recommendation over recent consultation", () => {
      const result = attributePurchaseToBa(
        makeInput({
          lastBaUserId: "ba-consultation",
          lastContactAt: new Date("2026-04-21T10:00:00Z"),
          activeRecommendations: [
            {
              baUserId: "ba-recommendation",
              productId: "product-1",
              recommendedAt: new Date("2026-04-15T10:00:00Z"),
              recommendationId: "rec-1",
            },
          ],
        }),
      );

      expect(result.attributedBaUserId).toBe("ba-recommendation");
      expect(result.attributionReason).toBe("active_recommendation");
    });
  });

  describe("Rule 3: no attribution", () => {
    it("returns null when no rules match", () => {
      const result = attributePurchaseToBa(makeInput({}));

      expect(result.attributedBaUserId).toBeNull();
      expect(result.attributionReason).toBeNull();
      expect(result.matchedRecommendationId).toBeNull();
    });
  });
});
