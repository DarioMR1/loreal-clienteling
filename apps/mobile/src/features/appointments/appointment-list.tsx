import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Appointment } from "@/types";
import { useAppointments } from "./hooks/use-appointments";
import { CreateAppointmentModal } from "./create-appointment-modal";
import { WeekStrip } from "./week-strip";
import { DayTimeline } from "./day-timeline";

interface AppointmentListProps {
  selectedId: string | null;
  onSelect: (appointment: Appointment) => void;
}

export function AppointmentList({
  selectedId,
  onSelect,
}: AppointmentListProps) {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showCreate, setShowCreate] = useState(false);
  const { data: appointments, isLoading, error, refetch } = useAppointments();

  const handleCreateSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

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
      {/* Header */}
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

      {/* Week strip calendar */}
      <WeekStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        appointments={appointments ?? []}
      />

      {/* Separator */}
      <View style={[styles.separator, { backgroundColor: theme.border }]} />

      {/* Day timeline */}
      <DayTimeline
        date={selectedDate}
        appointments={appointments ?? []}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      <CreateAppointmentModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
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
  separator: {
    height: StyleSheet.hairlineWidth,
    marginTop: Spacing.sm,
  },
});
