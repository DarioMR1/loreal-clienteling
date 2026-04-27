"use client";

import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/lib/hooks";

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  rescheduled: "Reagendada",
  cancelled: "Cancelada",
  completed: "Completada",
  no_show: "No asistió",
};

const STATUS_VARIANT: Record<string, "default" | "info" | "success" | "warning" | "destructive"> = {
  scheduled: "default",
  confirmed: "info",
  rescheduled: "warning",
  cancelled: "destructive",
  completed: "success",
  no_show: "destructive",
};

const EVENT_LABEL: Record<string, string> = {
  cabin_service: "Servicio cabina",
  facial: "Facial",
  anniversary_event: "Aniversario",
  vip_cabin: "Cabina VIP",
  product_followup: "Seguimiento",
  custom: "Personalizado",
};

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: () => void;
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const time = new Date(appointment.scheduledAt).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const status = appointment.status;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-border/50 bg-card p-2 text-left text-xs transition-all duration-200 hover:bg-muted/40 hover:shadow-sm"
    >
      <div className="mb-1 font-medium tabular-nums">{time}</div>
      <div className="mb-1.5 flex flex-wrap gap-1">
        <Badge variant="secondary" size="sm">
          {EVENT_LABEL[appointment.eventType] ?? appointment.eventType}
        </Badge>
        <Badge variant={STATUS_VARIANT[status] ?? "secondary"} size="sm">
          {STATUS_LABEL[status] ?? status}
        </Badge>
      </div>
      {appointment.comments && (
        <p className="truncate text-muted-foreground">{appointment.comments}</p>
      )}
    </button>
  );
}

export { STATUS_LABEL, STATUS_VARIANT, EVENT_LABEL };
