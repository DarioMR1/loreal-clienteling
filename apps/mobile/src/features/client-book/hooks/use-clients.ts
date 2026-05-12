import { useCallback, useState } from "react";
import { api } from "@/lib/api-client";
import { useApi, useMutation } from "@/hooks/use-api";
import type {
  Customer,
  BeautyProfile,
  Purchase,
  Recommendation,
  Sample,
  Communication,
  Consent,
} from "@/types";

// ─── Mutation input types ────────────────────────────────

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
}

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
}

export interface UpsertBeautyProfileInput {
  skinType?: string;
  skinTone?: string;
  skinSubtone?: string;
  skinConcerns?: string[];
  preferredIngredients?: string[];
  avoidedIngredients?: string[];
  fragrancePreferences?: string[];
  makeupPreferences?: Record<string, unknown>;
  routineType?: string;
  interests?: string[];
}

// ─── Mutation hooks ──────────────────────────────────────

export function useCreateCustomer() {
  return useMutation<CreateCustomerInput, Customer>((input) =>
    api.post<Customer>("/customers", input)
  );
}

export function useUpdateCustomer(customerId: string) {
  return useMutation<UpdateCustomerInput, Customer>((input) =>
    api.patch<Customer>(`/customers/${customerId}`, input)
  );
}

export function useUpdateBeautyProfile(customerId: string) {
  return useMutation<UpsertBeautyProfileInput, BeautyProfile>((input) =>
    api.put<BeautyProfile>(
      `/customers/${customerId}/beauty-profile`,
      input
    )
  );
}

/** Fetch paginated list of customers for the BA's store. */
export function useClients() {
  return useApi<Customer[]>(() => api.get<Customer[]>("/customers"), []);
}

/** Search customers by query string. */
export function useClientSearch() {
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const data = await api.get<Customer[]>("/customers/search", { query });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return { results, isSearching, search };
}

/** Fetch a single customer's full 360° data. */
export function useCustomerProfile(customerId: string | null) {
  const customer = useApi<Customer>(
    () =>
      customerId
        ? api.get<Customer>(`/customers/${customerId}`)
        : Promise.resolve(null as any),
    [customerId]
  );

  const beautyProfile = useApi<BeautyProfile | null>(
    () =>
      customerId
        ? api
            .get<BeautyProfile>(`/customers/${customerId}/beauty-profile`)
            .catch(() => null)
        : Promise.resolve(null),
    [customerId]
  );

  const purchases = useApi<Purchase[]>(
    () =>
      customerId
        ? api.get<Purchase[]>(`/customers/${customerId}/purchases`)
        : Promise.resolve([]),
    [customerId]
  );

  const recommendations = useApi<Recommendation[]>(
    () =>
      customerId
        ? api.get<Recommendation[]>(
            `/customers/${customerId}/recommendations`
          )
        : Promise.resolve([]),
    [customerId]
  );

  const samples = useApi<Sample[]>(
    () =>
      customerId
        ? api.get<Sample[]>(`/customers/${customerId}/samples`)
        : Promise.resolve([]),
    [customerId]
  );

  const communications = useApi<Communication[]>(
    () =>
      customerId
        ? api.get<Communication[]>(
            `/customers/${customerId}/communications`
          )
        : Promise.resolve([]),
    [customerId]
  );

  const consents = useApi<Consent[]>(
    () =>
      customerId
        ? api.get<Consent[]>(`/customers/${customerId}/consents`)
        : Promise.resolve([]),
    [customerId]
  );

  const isLoading =
    customer.isLoading ||
    beautyProfile.isLoading ||
    purchases.isLoading ||
    recommendations.isLoading;

  return {
    customer: customer.data,
    beautyProfile: beautyProfile.data,
    purchases: purchases.data ?? [],
    recommendations: recommendations.data ?? [],
    samples: samples.data ?? [],
    communications: communications.data ?? [],
    consents: consents.data ?? [],
    isLoading,
    error: customer.error,
    refetch: () => {
      customer.refetch();
      beautyProfile.refetch();
      purchases.refetch();
      recommendations.refetch();
      samples.refetch();
      communications.refetch();
      consents.refetch();
    },
  };
}
