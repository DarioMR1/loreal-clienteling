import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Appointment } from "@/types";
import { useAppointments } from "./hooks/use-appointments";

const eventTypeLabels: Record<string, string> = {
  cabin_service: "Servicio de cabina",
  facial: "Facial",
  anniversary_event: "Evento aniversario",
  vip_cabin: "Cabina VIP",
  product_followup: "Seguimiento de producto",
  custom: "Personalizado",
};

const eventTypeColors: Record<string, string> = {
  cabin_service: "#C9A96E",
  facial: "#5B7FA5",
  anniversary_event: "#7B1FA2",
  vip_cabin: "#C9A96E",
  product_followup: "#4A7C59",
  custom: "#6B6B6B",
};

const statusLabels: Record<string, string> = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  rescheduled: "Reagendada",
  cancelled: "Cancelada",
  completed: "Completada",
  no_show: "No asistió",
};

const statusColors: Record<string, string> = {
  scheduled: "#5B7FA5",
  confirmed: "#4A7C59",
  rescheduled: "#D4A017",
  cancelled: "#C44536",
  completed: "#5B7FA5",
  no_show: "#C44536",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface AppointmentListProps {
  selectedId: string | null;
  onSelect: (appointment: Appointment) => void;
}

export function AppointmentList({
  selectedId,
  onSelect,
}: AppointmentListProps) {
  const theme = useTheme();
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const { data: appointments, isLoading, error, refetch } = useAppointments();

  const now = new Date();
  const filtered = useMemo(() => {
    if (!appointments) return [];
    return appointments
      .filter((a) => {
        const d = new Date(a.scheduledAt);
        return filter === "upcoming" ? d >= now : d < now;
      })
      .sort((a, b) =>
        filter === "upcoming"
          ? new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime()
          : new Date(b.scheduledAt).getTime() -
            new Date(a.scheduledAt).getTime()
      );
  }, [appointments, filter]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          {error}
        </Text>
        <Pressable onPress={refetch}>
          <Text style={{ color: theme.accent }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Citas</Text>
      </View>

      {/* Filter toggle */}
      <View
        style={[styles.filterRow, { backgroundColor: theme.backgroundElement }]}
      >
        <Pressable
          onPress={() => setFilter("upcoming")}
          style={[
            styles.filterTab,
            filter === "upcoming" && { backgroundColor: theme.background },
          ]}
        >
          <Text
            style={[
              styles.filterLabel,
              {
                color:
                  filter === "upcoming" ? theme.text : theme.textSecondary,
              },
            ]}
          >
            Próximas
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter("past")}
          style={[
            styles.filterTab,
            filter === "past" && { backgroundColor: theme.background },
          ]}
        >
          <Text
            style={[
              styles.filterLabel,
              {
                color: filter === "past" ? theme.text : theme.textSecondary,
              },
            ]}
          >
            Pasadas
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          const eColor =
            eventTypeColors[item.eventType] ?? theme.textSecondary;

          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={[
                styles.row,
                { borderBottomColor: theme.borderLight },
                isSelected && { backgroundColor: theme.backgroundElement },
              ]}
            >
              <View
                style={[
                  styles.timeStrip,
                  { backgroundColor: eColor + "20" },
                ]}
              >
                <Text style={[styles.time, { color: eColor }]}>
                  {formatTime(item.scheduledAt)}
                </Text>
              </View>
              <View style={styles.info}>
                <Text
                  style={[styles.clientName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {item.customer
                    ? `${item.customer.firstName} ${item.customer.lastName}`
                    : "—"}
                </Text>
                <Text
                  style={[styles.eventType, { color: theme.textSecondary }]}
                >
                  {eventTypeLabels[item.eventType] ?? item.eventType} ·{" "}
                  {formatDate(item.scheduledAt)}
                </Text>
              </View>
              <StatusBadge
                label={statusLabels[item.status] ?? item.status}
                color={statusColors[item.status] ?? theme.textSecondary}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: { ...Typography.title2 },
  errorText: { ...Typography.body, marginBottom: Spacing.md },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: 8,
  },
  filterLabel: { ...Typography.subhead, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  timeStrip: {
    width: 52,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignItems: "center",
  },
  time: { ...Typography.subhead, fontWeight: "700" },
  info: { flex: 1, gap: 2 },
  clientName: { ...Typography.body, fontWeight: "600" },
  eventType: { ...Typography.caption1 },
});
