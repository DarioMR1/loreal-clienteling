import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { CreateCustomer, UpdateCustomer } from "@loreal/contracts";

// ── Types ──────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  birthDate: string | null;
  registeredAtStoreId: string;
  registeredByUserId: string;
  lastBaUserId: string | null;
  lifecycleSegment: string;
  customerSince: string;
  lastContactAt: string | null;
  lastTransactionAt: string | null;
  inactive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Query keys ─────────────────────────────────────────────────────

const customerKeys = {
  all: (params?: Record<string, string>) => ["customers", params ?? {}] as const,
  search: (query: string, type: string) => ["customers", "search", query, type] as const,
  detail: (id: string) => ["customers", id] as const,
};

// ── Queries ────────────────────────────────────────────────────────

export function useCustomers(params?: { page?: string; limit?: string; segment?: string; storeId?: string }) {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.segment) queryParams.segment = params.segment;
  if (params?.storeId) queryParams.storeId = params.storeId;

  return useQuery({
    queryKey: customerKeys.all(queryParams),
    queryFn: () => api.get<Customer[]>("/customers", queryParams),
  });
}

export function useCustomerSearch(query: string, type: string = "name") {
  return useQuery({
    queryKey: customerKeys.search(query, type),
    queryFn: () => api.get<Customer[]>("/customers/search", { query, type }),
    enabled: query.length >= 2,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => api.get<Customer>(`/customers/${id}`),
    enabled: !!id,
  });
}

// ── Mutations ──────────────────────────────────────────────────────

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomer) =>
      api.post<Customer>("/customers", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateCustomer) =>
      api.patch<Customer>(`/customers/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
    },
  });
}

export function useDeleteCustomerArco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, requestFolio }: { id: string; requestFolio: string }) =>
      api.delete<{ success: boolean; requestFolio: string }>(`/customers/${id}/arco`, { requestFolio }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
}
