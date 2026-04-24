import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────

export interface Store {
  id: string;
  code: string;
  displayName: string;
  chain: string;
  zoneId: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Query keys ─────────────────────────────────────────────────────

const storeKeys = {
  all: ["stores"] as const,
  detail: (id: string) => ["stores", id] as const,
};

// ── Queries ────────────────────────────────────────────────────────

export function useStores() {
  return useQuery({
    queryKey: storeKeys.all,
    queryFn: () => api.get<Store[]>("/stores"),
  });
}

export function useStore(id: string) {
  return useQuery({
    queryKey: storeKeys.detail(id),
    queryFn: () => api.get<Store>(`/stores/${id}`),
    enabled: !!id,
  });
}

// ── Mutations ──────────────────────────────────────────────────────

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      code: string;
      displayName: string;
      chain: string;
      zoneId?: string;
      address?: string;
      city?: string;
      state?: string;
    }) => api.post<Store>("/stores", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: storeKeys.all }),
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Omit<Store, "id" | "createdAt" | "updatedAt">>) =>
      api.patch<Store>(`/stores/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.all });
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(id) });
    },
  });
}
