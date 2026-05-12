import { api } from "@/lib/api-client";
import { useApi, useMutation } from "@/hooks/use-api";
import type { Appointment } from "@/types";

// ─── Mutation input types ────────────────────────────────

export interface CreateAppointmentInput {
  customerId: string;
  eventType: string;
  scheduledAt: string;
  durationMinutes: number;
  comments?: string;
  isVirtual?: boolean;
  videoLink?: string;
}

export interface UpdateAppointmentInput {
  status?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  comments?: string;
}

// ─── Mutation hooks ──────────────────────────────────────

export function useCreateAppointment() {
  return useMutation<CreateAppointmentInput, Appointment>((input) =>
    api.post<Appointment>("/appointments", input)
  );
}

export function useUpdateAppointment(appointmentId: string) {
  return useMutation<UpdateAppointmentInput, Appointment>((input) =>
    api.patch<Appointment>(`/appointments/${appointmentId}`, input)
  );
}

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
