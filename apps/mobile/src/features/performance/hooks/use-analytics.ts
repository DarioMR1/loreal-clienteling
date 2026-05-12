import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type {
  DashboardMetrics,
  ConversionMetrics,
  AppointmentMetrics,
  SalesBreakdown,
  SalesTrend,
  CustomerSegmentData,
} from "@/types";

/** Fetch the main dashboard KPIs. */
export function useDashboard(from?: string, to?: string) {
  return useApi<DashboardMetrics>(
    () => api.get<DashboardMetrics>("/analytics/dashboard", { from, to }),
    [from, to]
  );
}

/** Fetch conversion metrics (recommendation→sale, sample→sale). */
export function useConversion(from?: string, to?: string) {
  return useApi<ConversionMetrics>(
    () => api.get<ConversionMetrics>("/analytics/conversion", { from, to }),
    [from, to]
  );
}

/** Fetch appointment status breakdown. */
export function useAppointmentAnalytics(from?: string, to?: string) {
  return useApi<AppointmentMetrics>(
    () =>
      api.get<AppointmentMetrics>("/analytics/appointments", { from, to }),
    [from, to]
  );
}

/** Fetch sales breakdown by category or brand. */
export function useSalesBreakdown(
  groupBy: "category" | "brand",
  from?: string,
  to?: string
) {
  return useApi<SalesBreakdown>(
    () =>
      api.get<SalesBreakdown>("/analytics/sales-breakdown", {
        groupBy,
        from,
        to,
      }),
    [groupBy, from, to]
  );
}

/** Fetch sales trend time-series. */
export function useSalesTrend(
  interval: "day" | "week" | "month" = "month",
  from?: string,
  to?: string
) {
  return useApi<SalesTrend>(
    () =>
      api.get<SalesTrend>("/analytics/sales-trend", {
        interval,
        from,
        to,
      }),
    [interval, from, to]
  );
}

/** Fetch customer segment distribution. */
export function useCustomerSegments() {
  return useApi<CustomerSegmentData[]>(
    () => api.get<CustomerSegmentData[]>("/analytics/customers"),
    []
  );
}
