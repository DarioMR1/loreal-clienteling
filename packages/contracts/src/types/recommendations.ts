export interface CreateRecommendation {
  customerId: string;
  productId: string;
  source: string;
  visitReason?: string;
  aiReasoning?: string;
  notes?: string;
}

export interface AiRecommendationRequest {
  customerId: string;
  context?: string;
}
