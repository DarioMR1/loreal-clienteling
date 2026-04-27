"use client";

import { useCustomerRecommendations, type Recommendation } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";

const SOURCE_LABEL: Record<string, string> = {
  manual: "Manual",
  ai_suggested: "IA",
  replenishment_alert: "Reposición",
};

const SOURCE_VARIANT: Record<string, "default" | "info" | "secondary"> = {
  manual: "default",
  ai_suggested: "info",
  replenishment_alert: "secondary",
};

interface RecommendationsSectionProps {
  customerId: string;
}

export function RecommendationsSection({ customerId }: RecommendationsSectionProps) {
  const { data: recommendations = [], isLoading } =
    useCustomerRecommendations(customerId);

  const columns: Column<Recommendation>[] = [
    {
      key: "recommendedAt",
      label: "Fecha",
      render: (v) =>
        new Date(v as string).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "source",
      label: "Fuente",
      render: (v) => {
        const src = v as string;
        return (
          <Badge variant={SOURCE_VARIANT[src] ?? "secondary"} size="sm">
            {SOURCE_LABEL[src] ?? src}
          </Badge>
        );
      },
    },
    {
      key: "visitReason",
      label: "Motivo visita",
    },
    {
      key: "convertedToPurchase",
      label: "Convertida",
      render: (v) => (
        <Badge variant={v ? "success" : "secondary"} size="sm">
          {v ? "Sí" : "No"}
        </Badge>
      ),
    },
    {
      key: "notes",
      label: "Notas",
      render: (v) => {
        const text = v as string | null;
        if (!text) return "—";
        return text.length > 50 ? `${text.slice(0, 50)}...` : text;
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de recomendaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={recommendations}
          isLoading={isLoading}
          emptyTitle="Sin recomendaciones"
          emptyDescription="Esta clienta no tiene recomendaciones registradas"
        />
      </CardContent>
    </Card>
  );
}
