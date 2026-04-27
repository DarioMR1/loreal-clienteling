"use client";

import { useState } from "react";
import {
  useDashboardMetrics,
  useConversionMetrics,
  useCustomerSegments,
  useAnalyticsExport,
} from "@/lib/hooks";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const SEGMENT_LABEL: Record<string, string> = {
  new: "Nuevas",
  returning: "Recurrentes",
  vip: "VIP",
  at_risk: "En riesgo",
};

const SEGMENT_VARIANT: Record<
  string,
  "info" | "success" | "warning" | "destructive"
> = {
  new: "info",
  returning: "success",
  vip: "warning",
  at_risk: "destructive",
};

interface AnalyticsPageProps {
  user: { role?: string | null };
}

export function AnalyticsPage({ user }: AnalyticsPageProps) {
  const role = user.role ?? "ba";
  const { data: dashboard, isLoading: loadingDashboard } =
    useDashboardMetrics();
  const { data: conversion, isLoading: loadingConversion } =
    useConversionMetrics();
  const { data: segments = [], isLoading: loadingSegments } =
    useCustomerSegments();
  const exportData = useAnalyticsExport();
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Reportes"
        description="Métricas de rendimiento y analítica"
        action={
          <Button variant="outline" onClick={() => setShowExport(true)}>
            <ExportIcon className="mr-1.5 size-3.5" />
            Exportar
          </Button>
        }
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
            <CardDescription>
              Recomendaciones y muestras que generaron compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingConversion ? (
              <div className="space-y-3">
                <div className="h-4 w-48 animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-40 animate-pulse rounded-lg bg-muted" />
              </div>
            ) : (
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">
                    Recomendación → Compra
                  </dt>
                  <dd className="font-semibold tabular-nums">
                    {(
                      (conversion?.recommendationToSale.rate ?? 0) * 100
                    ).toFixed(1)}
                    %
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      ({conversion?.recommendationToSale.converted}/
                      {conversion?.recommendationToSale.total})
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Muestra → Compra</dt>
                  <dd className="font-semibold tabular-nums">
                    {((conversion?.sampleToSale.rate ?? 0) * 100).toFixed(1)}%
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      ({conversion?.sampleToSale.converted}/
                      {conversion?.sampleToSale.total})
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
            <CardDescription>
              Distribución del ciclo de vida de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSegments ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-32 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : (
              <dl className="space-y-3 text-sm">
                {segments.map((seg) => (
                  <div
                    key={seg.segment}
                    className="flex items-center justify-between"
                  >
                    <dt>
                      <Badge
                        variant={
                          SEGMENT_VARIANT[seg.segment] ?? "secondary"
                        }
                      >
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

      {/* Role-specific sections */}
      {(role === "manager" || role === "admin") && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de tienda</CardTitle>
            <CardDescription>
              {role === "manager"
                ? "Métricas de tu tienda"
                : "Métricas a nivel nacional"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div className="space-y-0.5">
                <dt className="text-muted-foreground">
                  Tasa de conversión global
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {(
                    (conversion?.recommendationToSale.rate ?? 0) * 100
                  ).toFixed(1)}
                  %
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-muted-foreground">Ventas del mes</dt>
                <dd className="text-lg font-semibold tabular-nums">
                  $
                  {Number(
                    dashboard?.salesThisMonth.totalAmount ?? 0,
                  ).toLocaleString("es-MX")}
                </dd>
              </div>
              <div className="space-y-0.5">
                <dt className="text-muted-foreground">
                  Citas completadas / total
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {dashboard?.appointmentsThisMonth ?? 0}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {(role === "supervisor" || role === "admin") && (
        <Card>
          <CardHeader>
            <CardTitle>Vista de zona</CardTitle>
            <CardDescription>
              {role === "supervisor"
                ? "Comparativo de tiendas en tu zona"
                : "Comparativo nacional"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Los datos detallados por tienda estarán disponibles cuando el
              backend exponga métricas desglosadas por store. Por ahora se
              muestran los totales agregados del scope del usuario.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Export Dialog */}
      <Dialog
        open={showExport}
        onOpenChange={(open) => !open && setShowExport(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar reporte</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="mb-4 text-sm text-muted-foreground">
              Selecciona el tipo de reporte a exportar en formato CSV.
            </p>
            <div className="space-y-2">
              {(
                [
                  { type: "customers" as const, label: "Clientes" },
                  { type: "sales" as const, label: "Ventas" },
                  { type: "appointments" as const, label: "Citas" },
                ] as const
              ).map(({ type, label }) => (
                <Button
                  key={type}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={exportData.isPending}
                  onClick={() =>
                    exportData.mutate(type, {
                      onSuccess: () => setShowExport(false),
                    })
                  }
                >
                  <DownloadIcon className="mr-2 size-3.5" />
                  {label}
                  {exportData.isPending && " (descargando...)"}
                </Button>
              ))}
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          <div className="h-7 w-20 animate-pulse rounded-lg bg-muted" />
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

function ExportIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v8M4.5 6.5L8 10l3.5-3.5" />
      <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v8M4.5 6.5L8 10l3.5-3.5" />
      <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
  );
}
