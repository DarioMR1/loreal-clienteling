import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentBadge } from "@/components/ui/badge";
import { statusLabels } from "@/constants/event-colors";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/hooks/use-theme";
import {
  useDashboard,
  useConversion,
  useAppointmentAnalytics,
  useSalesBreakdown,
  useSalesTrend,
  useCustomerSegments,
} from "./hooks/use-analytics";

function formatCurrency(amount: string | number): string {
  return (
    "$" +
    Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 0 })
  );
}

export function Dashboard() {
  const theme = useTheme();
  const { session } = useAuth();
  const { data: metrics, isLoading } = useDashboard();
  const { data: conversion } = useConversion();
  const { data: apptMetrics } = useAppointmentAnalytics();
  const { data: salesBreakdown } = useSalesBreakdown("category");
  const { data: salesTrend } = useSalesTrend("month");
  const { data: segments } = useCustomerSegments();

  const userName = session?.user?.fullName ?? session?.user?.name ?? "";
  const userImage = session?.user?.image ?? undefined;

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Avatar uri={userImage} size={48} />
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Hola, {userName.split(" ")[0]}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {session?.user?.email}
          </Text>
        </View>
      </View>

      {/* KPI Cards */}
      <SectionHeader title="Métricas del periodo" />
      <View style={styles.metricsGrid}>
        <KpiCard
          label="Ventas"
          value={formatCurrency(metrics?.sales?.totalAmount ?? "0")}
          icon="trending-up"
          accentColor={theme.accent}
        />
        <KpiCard
          label="Transacciones"
          value={String(metrics?.sales?.transactionCount ?? 0)}
          icon="bag"
          accentColor={theme.info}
        />
        <KpiCard
          label="Clientes nuevos"
          value={String(metrics?.newCustomers ?? 0)}
          icon="people"
          accentColor={theme.success}
        />
        <KpiCard
          label="Comunicaciones"
          value={String(metrics?.communicationsSent ?? 0)}
          icon="chatbubble"
          accentColor={theme.info}
        />
        <KpiCard
          label="Total clientes"
          value={String(metrics?.totalCustomers ?? 0)}
          icon="person"
          accentColor={theme.textSecondary}
        />
        <KpiCard
          label="Citas"
          value={String(metrics?.appointments ?? 0)}
          icon="calendar"
          accentColor={theme.warning}
        />
      </View>

      {/* Sales Trend */}
      {salesTrend && salesTrend.data.length > 0 && (
        <>
          <SectionHeader title="Tendencia de ventas" />
          <Card>
            <SalesTrendChart data={salesTrend.data} />
          </Card>
        </>
      )}

      {/* Conversion Rates */}
      {conversion && (
        <>
          <SectionHeader title="Tasas de conversión" />
          <View style={styles.conversionRow}>
            <ConversionCard
              label="Recomendación"
              sublabel="a compra"
              rate={conversion.recommendationToSale.rate}
              converted={conversion.recommendationToSale.converted}
              total={conversion.recommendationToSale.total}
              color={theme.accent}
            />
            <ConversionCard
              label="Muestra"
              sublabel="a compra"
              rate={conversion.sampleToSale.rate}
              converted={conversion.sampleToSale.converted}
              total={conversion.sampleToSale.total}
              color={theme.success}
            />
          </View>
        </>
      )}

      {/* Appointment Status Breakdown */}
      {apptMetrics && apptMetrics.total > 0 && (
        <>
          <SectionHeader title="Citas por estado" />
          <Card>
            <AppointmentStatusBars metrics={apptMetrics} />
          </Card>
        </>
      )}

      {/* Sales by Category */}
      {salesBreakdown && salesBreakdown.data.length > 0 && (
        <>
          <SectionHeader title="Ventas por categoría" />
          <Card>
            <CategoryBars data={salesBreakdown.data} />
          </Card>
        </>
      )}

      {/* Customer Segments */}
      {segments && segments.length > 0 && (
        <>
          <SectionHeader title="Segmentación de clientas" />
          <View style={styles.segmentRow}>
            {segments.map((s) => (
              <View
                key={s.segment}
                style={[styles.segmentCard, { backgroundColor: theme.background, borderColor: theme.border }]}
              >
                <Text style={[styles.segmentCount, { color: theme.text }]}>
                  {s.count}
                </Text>
                <SegmentBadge segment={s.segment} />
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// ─── Sub-components ──────────────────────────────────────

function KpiCard({
  label,
  value,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  icon: string;
  accentColor: string;
}) {
  const theme = useTheme();
  return (
    <Card style={styles.kpiCard}>
      <View style={[styles.kpiIconBg, { backgroundColor: accentColor + "15" }]}>
        <Icon name={icon as any} size={18} color={accentColor} />
      </View>
      <Text style={[styles.kpiValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
    </Card>
  );
}

function ConversionCard({
  label,
  sublabel,
  rate,
  converted,
  total,
  color,
}: {
  label: string;
  sublabel: string;
  rate: number;
  converted: number;
  total: number;
  color: string;
}) {
  const theme = useTheme();
  const pct = Math.round(rate * 100);

  return (
    <Card style={styles.conversionCard}>
      <Text style={[styles.conversionPct, { color }]}>{pct}%</Text>
      <View style={styles.conversionBarBg}>
        <View
          style={[
            styles.conversionBarFill,
            { width: `${Math.min(pct, 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={[styles.conversionLabel, { color: theme.text }]}>
        {label}
      </Text>
      <Text style={[styles.conversionSub, { color: theme.textSecondary }]}>
        {sublabel} · {converted}/{total}
      </Text>
    </Card>
  );
}

function SalesTrendChart({
  data,
}: {
  data: { date: string; totalAmount: string; transactionCount: number }[];
}) {
  const theme = useTheme();

  const amounts = data.map((d) => Number(d.totalAmount));
  const maxAmount = Math.max(...amounts, 1);

  return (
    <View style={styles.trendContainer}>
      <View style={styles.trendBars}>
        {data.map((d, i) => {
          const height = Math.max((Number(d.totalAmount) / maxAmount) * 120, 4);
          const dateLabel = new Date(d.date).toLocaleDateString("es-MX", {
            month: "short",
          });
          return (
            <View key={i} style={styles.trendCol}>
              <Text style={[styles.trendAmount, { color: theme.textSecondary }]}>
                {formatCurrency(d.totalAmount)}
              </Text>
              <View
                style={[
                  styles.trendBar,
                  { height, backgroundColor: theme.accent },
                ]}
              />
              <Text style={[styles.trendDate, { color: theme.textTertiary }]}>
                {dateLabel}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function AppointmentStatusBars({
  metrics,
}: {
  metrics: {
    total: number;
    completed: number;
    confirmed: number;
    scheduled: number;
    rescheduled: number;
    cancelled: number;
    noShow: number;
  };
}) {
  const theme = useTheme();
  const items = [
    { key: "completed", label: "Completadas", count: metrics.completed, color: theme.success },
    { key: "confirmed", label: "Confirmadas", count: metrics.confirmed, color: theme.info },
    { key: "scheduled", label: "Programadas", count: metrics.scheduled, color: theme.info },
    { key: "rescheduled", label: "Reagendadas", count: metrics.rescheduled, color: theme.warning },
    { key: "cancelled", label: "Canceladas", count: metrics.cancelled, color: theme.danger },
    { key: "noShow", label: "No asistió", count: metrics.noShow, color: theme.danger },
  ].filter((i) => i.count > 0);

  return (
    <View style={styles.statusContainer}>
      {items.map((item) => {
        const pct = metrics.total > 0 ? (item.count / metrics.total) * 100 : 0;
        return (
          <View key={item.key} style={styles.statusRow}>
            <Text
              style={[styles.statusLabel, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            <View style={[styles.statusBarBg, { backgroundColor: theme.backgroundElement }]}>
              <View
                style={[
                  styles.statusBarFill,
                  {
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text style={[styles.statusCount, { color: theme.textSecondary }]}>
              {item.count}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function CategoryBars({
  data,
}: {
  data: { category?: string; totalAmount: string; itemCount: number }[];
}) {
  const theme = useTheme();
  const total = data.reduce((sum, d) => sum + Number(d.totalAmount), 0);

  const categoryLabels: Record<string, string> = {
    skincare: "Skincare",
    makeup: "Makeup",
    fragrance: "Fragancia",
  };

  return (
    <View style={styles.statusContainer}>
      {data
        .sort((a, b) => Number(b.totalAmount) - Number(a.totalAmount))
        .map((d) => {
          const pct = total > 0 ? (Number(d.totalAmount) / total) * 100 : 0;
          return (
            <View key={d.category ?? "other"} style={styles.statusRow}>
              <Text
                style={[styles.statusLabel, { color: theme.text }]}
                numberOfLines={1}
              >
                {categoryLabels[d.category ?? ""] ?? d.category ?? "Otro"}
              </Text>
              <View
                style={[
                  styles.statusBarBg,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <View
                  style={[
                    styles.statusBarFill,
                    { width: `${Math.min(pct, 100)}%`, backgroundColor: theme.accent },
                  ]}
                />
              </View>
              <Text style={[styles.statusCount, { color: theme.textSecondary }]}>
                {Math.round(pct)}%
              </Text>
            </View>
          );
        })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  greeting: { ...Typography.title2 },
  subtitle: { ...Typography.subhead },

  // KPI Grid
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  kpiCard: {
    flexBasis: "31%",
    flexGrow: 1,
    alignItems: "center",
    minWidth: 140,
    gap: Spacing.xs,
  },
  kpiIconBg: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: { ...Typography.title2 },
  kpiLabel: { ...Typography.caption1, textAlign: "center" },

  // Conversion
  conversionRow: { flexDirection: "row", gap: Spacing.sm },
  conversionCard: { flex: 1, alignItems: "center", gap: Spacing.xs },
  conversionPct: { ...Typography.title1, fontWeight: "700" },
  conversionBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: "#E8E8E8",
    borderRadius: 3,
    overflow: "hidden",
  },
  conversionBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  conversionLabel: { ...Typography.subhead, fontWeight: "600" },
  conversionSub: { ...Typography.caption1 },

  // Sales Trend
  trendContainer: { gap: Spacing.sm },
  trendBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: Spacing.xs,
    minHeight: 160,
  },
  trendCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  trendAmount: { ...Typography.caption2, textAlign: "center" },
  trendBar: {
    width: "80%",
    borderRadius: 4,
    minWidth: 16,
  },
  trendDate: { ...Typography.caption2, textAlign: "center" },

  // Status Bars (appointments + categories)
  statusContainer: { gap: Spacing.md },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusLabel: {
    ...Typography.caption1,
    fontWeight: "600",
    width: 90,
  },
  statusBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  statusBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  statusCount: { ...Typography.caption1, width: 32, textAlign: "right" },

  // Segments
  segmentRow: { flexDirection: "row", gap: Spacing.sm },
  segmentCard: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  segmentCount: { ...Typography.title2 },
});
