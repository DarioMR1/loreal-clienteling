import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Appointment } from "@/types";
import { useAppointments } from "./hooks/use-appointments";
import { CreateAppointmentModal } from "./create-appointment-modal";

import {
  eventTypeLabels,
  eventTypeColors,
  statusLabels,
  statusColors,
} from "@/constants/event-colors";

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
  const [showCreate, setShowCreate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: appointments, isLoading, error, refetch } = useAppointments();

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

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
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>Citas</Text>
          <IconButton
            icon="add"
            variant="accent"
            size="sm"
            onPress={() => setShowCreate(true)}
          />
        </View>
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.accent}
          />
        }
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

      <CreateAppointmentModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={refetch}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
