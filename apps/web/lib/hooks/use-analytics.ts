import { useQuery, useMutation } from "@tanstack/react-query";
import { api, apiFetch } from "@/lib/api-client";

// ── Types ──────────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalCustomers: number;
  salesThisMonth: {
    totalAmount: string;
    transactionCount: number;
  };
  appointmentsThisMonth: number;
  newCustomersThisMonth: number;
}

export interface ConversionMetrics {
  recommendationToSale: {
    total: number;
    converted: number;
    rate: number;
  };
  sampleToSale: {
    total: number;
    converted: number;
    rate: number;
  };
}

export interface SegmentCount {
  segment: string;
  count: number;
}

// ── Query keys ─────────────────────────────────────────────────────

const analyticsKeys = {
  dashboard: ["analytics", "dashboard"] as const,
  conversion: ["analytics", "conversion"] as const,
  customers: ["analytics", "customers"] as const,
};

// ── Queries ────────────────────────────────────────────────────────

export function useDashboardMetrics() {
  return useQuery({
    queryKey: analyticsKeys.dashboard,
    queryFn: () => api.get<DashboardMetrics>("/analytics/dashboard"),
  });
}

export function useConversionMetrics() {
  return useQuery({
    queryKey: analyticsKeys.conversion,
    queryFn: () => api.get<ConversionMetrics>("/analytics/conversion"),
  });
}

export function useCustomerSegments() {
  return useQuery({
    queryKey: analyticsKeys.customers,
    queryFn: () => api.get<SegmentCount[]>("/analytics/customers"),
  });
}

export function useAnalyticsExport() {
  return useMutation({
    mutationFn: async (type: "customers" | "sales" | "appointments") => {
      const data = await api.get<unknown[]>("/analytics/export", { type });
      // Convert to CSV and trigger download
      if (!Array.isArray(data) || data.length === 0) return;
      const headers = Object.keys(data[0] as object);
      const rows = data.map((row) =>
        headers.map((h) => {
          const val = (row as Record<string, unknown>)[h];
          const str = val == null ? "" : String(val);
          return str.includes(",") ? `"${str}"` : str;
        }).join(","),
      );
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${type}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
