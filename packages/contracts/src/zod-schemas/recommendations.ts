import { z } from "zod";
import { RECOMMENDATION_SOURCES, VISIT_REASONS } from "../enums/recommendation";

export const createRecommendationSchema = z.object({
  customerId: z.string().uuid(),
  productId: z.string().uuid(),
  source: z.enum(RECOMMENDATION_SOURCES as [string, ...string[]]),
  visitReason: z.enum(VISIT_REASONS as [string, ...string[]]).optional(),
  aiReasoning: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateRecommendation = z.infer<typeof createRecommendationSchema>;

export const aiRecommendationRequestSchema = z.object({
  customerId: z.string().uuid(),
  context: z.string().max(2000).optional(),
});

export type AiRecommendationRequest = z.infer<
  typeof aiRecommendationRequestSchema
>;
