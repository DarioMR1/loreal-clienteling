import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

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
