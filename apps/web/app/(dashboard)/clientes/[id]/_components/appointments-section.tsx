"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";

interface Appointment {
  id: string;
  customerId: string;
  baUserId: string;
  storeId: string;
  eventType: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  comments: string | null;
  isVirtual: boolean;
}

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
  anniversary_event: "Evento aniversario",
  vip_cabin: "Cabina VIP",
  product_followup: "Seguimiento producto",
  custom: "Personalizado",
};

interface AppointmentsSectionProps {
  customerId: string;
}

export function AppointmentsSection({ customerId }: AppointmentsSectionProps) {
  // Fetch all appointments and filter client-side by customerId
  // (backend doesn't yet support customerId filter)
  const { data: allAppointments = [], isLoading } = useQuery({
    queryKey: ["appointments", "customer", customerId],
    queryFn: () => api.get<Appointment[]>("/appointments"),
    enabled: !!customerId,
  });

  const appointments = allAppointments.filter(
    (a) => a.customerId === customerId,
  );

  const columns: Column<Appointment>[] = [
    {
      key: "scheduledAt",
      label: "Fecha",
      render: (v) =>
        new Date(v as string).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "eventType",
      label: "Tipo",
      render: (v) => (
        <Badge variant="secondary" size="sm">
          {EVENT_LABEL[v as string] ?? (v as string)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (v) => {
        const s = v as string;
        return (
          <Badge variant={STATUS_VARIANT[s] ?? "secondary"} size="sm">
            {STATUS_LABEL[s] ?? s}
          </Badge>
        );
      },
    },
    {
      key: "durationMinutes",
      label: "Duración",
      render: (v) => `${v} min`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citas</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={appointments}
          isLoading={isLoading}
          emptyTitle="Sin citas"
          emptyDescription="Esta clienta no tiene citas registradas"
        />
      </CardContent>
    </Card>
  );
}
