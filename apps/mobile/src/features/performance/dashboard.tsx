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
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing, Typography } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/hooks/use-theme";
import { useDashboard, useConversion } from "./hooks/use-analytics";

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("es-MX", { minimumFractionDigits: 0 });
}

export function Dashboard() {
  const theme = useTheme();
  const { session } = useAuth();
  const { data: metrics, isLoading } = useDashboard();
  const { data: conversion } = useConversion();

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

      {/* KPI metrics */}
      <SectionHeader title="Métricas del periodo" />
      <View style={styles.metricsGrid}>
        <MetricCard
          label="Ventas"
          value={formatCurrency(metrics?.totalSales ?? 0)}
        />
        <MetricCard
          label="Transacciones"
          value={String(metrics?.salesCount ?? 0)}
        />
        <MetricCard
          label="Clientes nuevos"
          value={String(metrics?.newCustomers ?? 0)}
        />
        <MetricCard
          label="Comunicaciones"
          value={String(metrics?.communicationsSent ?? 0)}
        />
        <MetricCard
          label="Total clientes"
          value={String(metrics?.totalCustomers ?? 0)}
        />
        <MetricCard
          label="Citas"
          value={String(metrics?.totalAppointments ?? 0)}
        />
      </View>

      {/* Conversion rates */}
      {conversion && (
        <>
          <SectionHeader title="Tasas de conversión" />
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Recomendación → Compra"
              value={`${Math.round(conversion.recommendationToSale.rate)}%`}
              detail={`${conversion.recommendationToSale.converted}/${conversion.recommendationToSale.total}`}
            />
            <MetricCard
              label="Muestra → Compra"
              value={`${Math.round(conversion.sampleToSale.rate)}%`}
              detail={`${conversion.sampleToSale.converted}/${conversion.sampleToSale.total}`}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  const theme = useTheme();
  return (
    <Card style={styles.metricCard}>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      {detail && (
        <Text style={[styles.metricDetail, { color: theme.textTertiary }]}>
          {detail}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  content: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: Spacing["4xl"] },
  headerRow: { flexDirection: "row", alignItems: "center", gap: Spacing.lg },
  greeting: { ...Typography.title2 },
  subtitle: { ...Typography.subhead },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  metricCard: {
    flexBasis: "31%",
    flexGrow: 1,
    alignItems: "center",
    minWidth: 140,
  },
  metricValue: { ...Typography.title2 },
  metricLabel: { ...Typography.caption1, marginTop: 2, textAlign: "center" },
  metricDetail: { ...Typography.caption2, marginTop: 2 },
});
