import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
}

// ── Query keys ─────────────────────────────────────────────────────

export interface AuditLogFilters {
  page?: string;
  limit?: string;
  action?: string;
  entityType?: string;
  actorUserId?: string;
  from?: string;
  to?: string;
}

const auditKeys = {
  list: (filters: AuditLogFilters) => ["audit-logs", filters] as const,
  detail: (id: string) => ["audit-logs", id] as const,
};

// ── Queries (read-only — audit logs are never mutated from frontend) ─

export function useAuditLogs(filters: AuditLogFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.action) params.action = filters.action;
  if (filters.entityType) params.entityType = filters.entityType;
  if (filters.actorUserId) params.actorUserId = filters.actorUserId;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;

  return useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: () => api.get<AuditLog[]>("/audit-logs", params),
  });
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: auditKeys.detail(id),
    queryFn: () => api.get<AuditLog>(`/audit-logs/${id}`),
    enabled: !!id,
  });
}
