export {
  calculateSegment,
  type SegmentationInput,
  type SegmentationResult,
} from "./customer-segmentation/calculate-segment";

export {
  calculateNextPurchase,
  type ReplenishmentInput,
  type ReplenishmentResult,
  type PurchaseRecord,
} from "./replenishment/calculate-next-purchase";

export {
  attributePurchaseToBa,
  type AttributionInput,
  type AttributionResult,
  type RecommendationRecord,
} from "./attribution/attribute-purchase-to-ba";

export {
  generateLifeEventAlerts,
  type CustomerForAlerts,
  type LifeEventAlert,
} from "./lifecycle-events/generate-life-event-alerts";

export {
  findMatchingShades,
  type ShadeMatchInput,
  type ShadeMatchResult,
  type ShadeRecord,
} from "./shade-matching/find-matching-shades";

export {
  rankCustomerSearchResults,
  type CustomerSearchRecord,
  type SearchRankingInput,
  type RankedSearchResult,
} from "./search/rank-customer-search-results";
