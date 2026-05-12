import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type {
  DashboardMetrics,
  BaPerformance,
  ConversionMetrics,
} from "@/types";

/** Fetch the main dashboard KPIs. */
export function useDashboard(from?: string, to?: string) {
  return useApi<DashboardMetrics>(
    () => api.get<DashboardMetrics>("/analytics/dashboard", { from, to }),
    [from, to]
  );
}

/** Fetch BA performance data (used by managers, but also the BA's own stats). */
export function useBaPerformance(from?: string, to?: string) {
  return useApi<BaPerformance[]>(
    () =>
      api.get<BaPerformance[]>("/analytics/ba-performance", { from, to }),
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

/** Fetch appointment analytics. */
export function useAppointmentAnalytics(from?: string, to?: string) {
  return useApi<Record<string, number>>(
    () =>
      api.get<Record<string, number>>("/analytics/appointments", {
        from,
        to,
      }),
    [from, to]
  );
}
