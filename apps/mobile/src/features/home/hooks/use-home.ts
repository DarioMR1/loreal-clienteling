import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { Appointment, Customer, DashboardMetrics } from "@/types";

/** Fetch today's appointments for the Home dashboard. */
export function useTodayAppointments() {
  const today = new Date().toISOString().split("T")[0];
  return useApi<Appointment[]>(
    () => api.get<Appointment[]>("/appointments", { from: today, to: today }),
    [today]
  );
}

/** Fetch dashboard metrics for the Home dashboard. */
export function useHomeDashboard() {
  return useApi<DashboardMetrics>(
    () => api.get<DashboardMetrics>("/analytics/dashboard"),
    []
  );
}

/** Fetch at-risk clients for alerts. */
export function useAtRiskClients() {
  return useApi<Customer[]>(
    () => api.get<Customer[]>("/customers", { segment: "at_risk" }),
    []
  );
}
