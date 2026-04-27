"use client";

import { useCustomerCommunications, type Communication } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";

const CHANNEL_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  sms: "SMS",
  email: "Email",
};

const CHANNEL_VARIANT: Record<string, "default" | "info" | "success"> = {
  whatsapp: "success",
  sms: "default",
  email: "info",
};

const FOLLOWUP_LABEL: Record<string, string> = {
  "3_months": "3 meses",
  "6_months": "6 meses",
  birthday: "Cumpleaños",
  replenishment: "Reposición",
  special_event: "Evento especial",
  custom: "Personalizado",
};

interface CommunicationsSectionProps {
  customerId: string;
}

export function CommunicationsSection({ customerId }: CommunicationsSectionProps) {
  const { data: comms = [], isLoading } =
    useCustomerCommunications(customerId);

  const columns: Column<Communication>[] = [
    {
      key: "sentAt",
      label: "Fecha",
      render: (v) =>
        new Date(v as string).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "channel",
      label: "Canal",
      render: (v) => {
        const ch = v as string;
        return (
          <Badge variant={CHANNEL_VARIANT[ch] ?? "secondary"} size="sm">
            {CHANNEL_LABEL[ch] ?? ch}
          </Badge>
        );
      },
    },
    {
      key: "followupType",
      label: "Tipo",
      render: (v) => (
        <Badge variant="secondary" size="sm">
          {FOLLOWUP_LABEL[v as string] ?? (v as string)}
        </Badge>
      ),
    },
    {
      key: "deliveredAt",
      label: "Estado",
      render: (_: unknown, row: Communication) => {
        if (row.respondedAt) return <Badge variant="success" size="sm">Respondido</Badge>;
        if (row.readAt) return <Badge variant="info" size="sm">Leído</Badge>;
        if (row.deliveredAt) return <Badge variant="default" size="sm">Entregado</Badge>;
        return <Badge variant="secondary" size="sm">Enviado</Badge>;
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguimiento y comunicaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={comms}
          isLoading={isLoading}
          emptyTitle="Sin comunicaciones"
          emptyDescription="No se han enviado seguimientos a esta clienta"
        />
      </CardContent>
    </Card>
  );
}
