import { api } from "@/lib/api-client";
import { useApi, useMutation } from "@/hooks/use-api";
import type {
  Product,
  ProductAvailability,
  Purchase,
  Recommendation,
  Sample,
} from "@/types";

// ─── Mutation input types ────────────────────────────────

export interface PurchaseItemInput {
  productId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseInput {
  customerId: string;
  source: string;
  items: PurchaseItemInput[];
  totalAmount: number;
  posTransactionId?: string;
}

export interface CreateRecommendationInput {
  customerId: string;
  productId: string;
  source: string;
  visitReason?: string;
  notes?: string;
}

export interface CreateSampleInput {
  customerId: string;
  productId: string;
}

// ─── Mutation hooks ──────────────────────────────────────

export function useCreatePurchase() {
  return useMutation<CreatePurchaseInput, Purchase>((input) =>
    api.post<Purchase>("/purchases", input)
  );
}

export function useCreateRecommendation() {
  return useMutation<CreateRecommendationInput, Recommendation>((input) =>
    api.post<Recommendation>("/recommendations", input)
  );
}

export function useCreateSample() {
  return useMutation<CreateSampleInput, Sample>((input) =>
    api.post<Sample>("/samples", input)
  );
}

/** Fetch products for the BA's brand with optional category/search filter. */
export function useProducts(category?: string, search?: string) {
  return useApi<Product[]>(
    () =>
      api.get<Product[]>("/products", {
        ...(category && category !== "all" ? { category } : {}),
        ...(search ? { search } : {}),
      }),
    [category, search]
  );
}

/** Fetch a single product's availability at the BA's store. */
export function useProductAvailability(productId: string | null) {
  return useApi<ProductAvailability[]>(
    () =>
      productId
        ? api.get<ProductAvailability[]>(
            `/products/${productId}/availability`
          )
        : Promise.resolve([]),
    [productId]
  );
}
