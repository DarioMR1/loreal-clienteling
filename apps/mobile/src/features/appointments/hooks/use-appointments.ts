import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/use-api";
import type { Appointment } from "@/types";

/** Fetch appointments for the current BA, optionally filtered by date range. */
export function useAppointments(from?: string, to?: string) {
  return useApi<Appointment[]>(
    () =>
      api.get<Appointment[]>("/appointments", {
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      }),
    [from, to]
  );
}

/** Fetch a single appointment by ID. */
export function useAppointment(appointmentId: string | null) {
  return useApi<Appointment>(
    () =>
      appointmentId
        ? api.get<Appointment>(`/appointments/${appointmentId}`)
        : Promise.resolve(null as any),
    [appointmentId]
  );
}
