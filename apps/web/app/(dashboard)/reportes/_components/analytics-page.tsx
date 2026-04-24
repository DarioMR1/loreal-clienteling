"use client";

import { useDashboardMetrics, useConversionMetrics, useCustomerSegments } from "@/lib/hooks";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SEGMENT_LABEL: Record<string, string> = {
  new: "Nuevas",
  returning: "Recurrentes",
  vip: "VIP",
  at_risk: "En riesgo",
};

const SEGMENT_VARIANT: Record<string, "info" | "success" | "warning" | "destructive"> = {
  new: "info",
  returning: "success",
  vip: "warning",
  at_risk: "destructive",
};

export function AnalyticsPage() {
  const { data: dashboard, isLoading: loadingDashboard } = useDashboardMetrics();
  const { data: conversion, isLoading: loadingConversion } = useConversionMetrics();
  const { data: segments = [], isLoading: loadingSegments } = useCustomerSegments();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Reportes"
        description="Métricas de rendimiento y analítica"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Clientes totales"
          value={dashboard?.totalCustomers ?? 0}
          isLoading={loadingDashboard}
        />
        <MetricCard
          title="Ventas del mes"
          value={`$${Number(dashboard?.salesThisMonth.totalAmount ?? 0).toLocaleString("es-MX")}`}
          subtitle={`${dashboard?.salesThisMonth.transactionCount ?? 0} transacciones`}
          isLoading={loadingDashboard}
        />
        <MetricCard
          title="Citas del mes"
          value={dashboard?.appointmentsThisMonth ?? 0}
          isLoading={loadingDashboard}
        />
        <MetricCard
          title="Clientes nuevos"
          value={dashboard?.newCustomersThisMonth ?? 0}
          subtitle="Este mes"
          isLoading={loadingDashboard}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Conversion */}
        <Card>
          <CardHeader>
            <CardTitle>Conversión</CardTitle>
            <CardDescription>Recomendaciones y muestras que generaron compra</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingConversion ? (
              <div className="space-y-3">
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Recomendación → Compra</dt>
                  <dd className="font-semibold tabular-nums">
                    {((conversion?.recommendationToSale.rate ?? 0) * 100).toFixed(1)}%
                    <span className="ml-1 text-xs text-muted-foreground font-normal">
                      ({conversion?.recommendationToSale.converted}/{conversion?.recommendationToSale.total})
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Muestra → Compra</dt>
                  <dd className="font-semibold tabular-nums">
                    {((conversion?.sampleToSale.rate ?? 0) * 100).toFixed(1)}%
                    <span className="ml-1 text-xs text-muted-foreground font-normal">
                      ({conversion?.sampleToSale.converted}/{conversion?.sampleToSale.total})
                    </span>
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>

        {/* Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Segmentos</CardTitle>
            <CardDescription>Distribución del ciclo de vida de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSegments ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-32 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : (
              <dl className="space-y-3 text-sm">
                {segments.map((seg) => (
                  <div key={seg.segment} className="flex items-center justify-between">
                    <dt>
                      <Badge variant={SEGMENT_VARIANT[seg.segment] ?? "secondary"}>
                        {SEGMENT_LABEL[seg.segment] ?? seg.segment}
                      </Badge>
                    </dt>
                    <dd className="font-semibold tabular-nums">{seg.count}</dd>
                  </div>
                ))}
              </dl>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  isLoading,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        {isLoading ? (
          <div className="h-7 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
        )}
        {subtitle && !isLoading && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
    </Card>
  );
}
