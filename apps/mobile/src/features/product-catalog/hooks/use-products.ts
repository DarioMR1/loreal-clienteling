import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { Product, ProductAvailability } from "@/types";

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
