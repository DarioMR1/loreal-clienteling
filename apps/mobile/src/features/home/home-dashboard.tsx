import React from "react";
import {
  ActivityIndicator,
  Pressable,
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
import { StatusBadge } from "@/components/ui/badge";
import {
  eventTypeLabels,
  eventTypeColors,
  statusLabels,
  statusColors,
} from "@/constants/event-colors";
import { Spacing, Typography } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/hooks/use-theme";
import {
  useTodayAppointments,
  useHomeDashboard,
  useAtRiskClients,
} from "./hooks/use-home";

function formatCurrency(amount: string | number): string {
  return "$" + Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 0 });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function HomeDashboard() {
  const theme = useTheme();
  const { session } = useAuth();
  const { data: appointments, isLoading: loadingAppts } =
    useTodayAppointments();
  const { data: metrics, isLoading: loadingMetrics } = useHomeDashboard();
  const { data: atRiskClients } = useAtRiskClients();

  const userName = session?.user?.fullName ?? session?.user?.name ?? "";
  const userImage = session?.user?.image ?? undefined;

  if (loadingAppts && loadingMetrics) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundSecondary }]}>
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
      {/* Greeting */}
      <View style={styles.headerRow}>
        <Avatar uri={userImage} size={48} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Hola, {userName.split(" ")[0]}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {getTodayLabel()}
          </Text>
        </View>
      </View>

      {/* Quick stats */}
      {metrics && (
        <>
          <SectionHeader title="Resumen" />
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {formatCurrency(metrics.sales?.totalAmount ?? "0")}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Ventas
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {metrics.totalCustomers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Clientes
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {metrics.newCustomers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Nuevos
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {metrics.appointments}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Citas
              </Text>
            </Card>
          </View>
        </>
      )}

      {/* Today's appointments */}
      <SectionHeader title="Citas de hoy" />
      {(!appointments || appointments.length === 0) ? (
        <Card>
          <View style={styles.emptyRow}>
            <Icon name="calendar" size={20} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No hay citas programadas para hoy.
            </Text>
          </View>
        </Card>
      ) : (
        appointments.map((appt) => {
          const eColor =
            eventTypeColors[appt.eventType] ?? theme.textSecondary;
          return (
            <Card key={appt.id}>
              <View style={styles.apptRow}>
                <View
                  style={[
                    styles.timeBadge,
                    { backgroundColor: eColor + "18" },
                  ]}
                >
                  <Text style={[styles.timeText, { color: eColor }]}>
                    {formatTime(appt.scheduledAt)}
                  </Text>
                </View>
                <View style={styles.apptInfo}>
                  <Text style={[styles.apptClient, { color: theme.text }]}>
                    {appt.customer
                      ? `${appt.customer.firstName} ${appt.customer.lastName}`
                      : "—"}
                  </Text>
                  <Text style={[styles.apptType, { color: theme.textSecondary }]}>
                    {eventTypeLabels[appt.eventType] ?? appt.eventType} ·{" "}
                    {appt.durationMinutes} min
                  </Text>
                </View>
                <StatusBadge
                  label={statusLabels[appt.status] ?? appt.status}
                  color={statusColors[appt.status] ?? theme.textSecondary}
                />
              </View>
            </Card>
          );
        })
      )}

      {/* At-risk alerts */}
      {atRiskClients && atRiskClients.length > 0 && (
        <>
          <SectionHeader title="Clientas en riesgo" />
          <Card>
            {atRiskClients.slice(0, 5).map((client) => (
              <View key={client.id} style={styles.alertRow}>
                <Icon name="alert-circle" size={16} color={theme.warning} />
                <Text
                  style={[styles.alertName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {client.firstName} {client.lastName}
                </Text>
                <SegmentBadge segment="at_risk" />
              </View>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

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
  date: { ...Typography.subhead, textTransform: "capitalize" },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statCard: { flex: 1, alignItems: "center" },
  statValue: { ...Typography.title2 },
  statLabel: { ...Typography.caption1, marginTop: 2 },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyText: { ...Typography.body },
  apptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  timeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  timeText: { ...Typography.subhead, fontWeight: "700" },
  apptInfo: { flex: 1, gap: 2 },
  apptClient: { ...Typography.body, fontWeight: "600" },
  apptType: { ...Typography.caption1 },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  alertName: { ...Typography.body, flex: 1 },
});
