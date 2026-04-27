import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Communication } from "./use-customer-detail";
import type { CreateCommunication } from "@loreal/contracts";

// ── Query keys ─────────────────────────────────────────────────────

const commKeys = {
  all: ["communications"] as const,
};

// ── Queries ────────────────────────────────────────────────────────

export function useCommunications() {
  return useQuery({
    queryKey: commKeys.all,
    queryFn: () => api.get<Communication[]>("/communications"),
  });
}

// ── Mutations ──────────────────────────────────────────────────────

export function useCreateCommunication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommunication) =>
      api.post<Communication>("/communications", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commKeys.all });
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

export function useUpdateCommunicationTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      deliveredAt?: string;
      readAt?: string;
      respondedAt?: string;
    }) => api.patch<Communication>(`/communications/${id}/tracking`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: commKeys.all }),
  });
}
