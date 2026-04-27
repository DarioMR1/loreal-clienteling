"use client";

import { useCustomerPurchases, type Purchase } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";

const SOURCE_LABEL: Record<string, string> = {
  pos_integration: "POS",
  manual: "Manual",
  ecommerce: "E-commerce",
};

const SOURCE_VARIANT: Record<string, "default" | "info" | "secondary"> = {
  pos_integration: "info",
  manual: "default",
  ecommerce: "secondary",
};

interface PurchasesSectionProps {
  customerId: string;
}

export function PurchasesSection({ customerId }: PurchasesSectionProps) {
  const { data: purchases = [], isLoading } = useCustomerPurchases(customerId);

  const columns: Column<Purchase>[] = [
    {
      key: "purchasedAt",
      label: "Fecha",
      render: (v) =>
        new Date(v as string).toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (v) =>
        `$${Number(v).toLocaleString("es-MX", {
          minimumFractionDigits: 2,
        })}`,
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
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de compras</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={purchases}
          isLoading={isLoading}
          emptyTitle="Sin compras"
          emptyDescription="Esta clienta no tiene compras registradas"
        />
      </CardContent>
    </Card>
  );
}
