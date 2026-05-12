import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Radius, Spacing, Typography } from "@/constants/theme";
import {
  eventTypeLabels,
  eventTypeColors,
  eventTypeIcons,
  statusLabels,
  statusColors,
} from "@/constants/event-colors";
import { useTheme } from "@/hooks/use-theme";
import type { Appointment } from "@/types";
import { useUpdateAppointment } from "./hooks/use-appointments";
import { RescheduleModal } from "./reschedule-modal";

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEndTime(dateStr: string, durationMinutes: number): string {
  const end = new Date(new Date(dateStr).getTime() + durationMinutes * 60_000);
  return end.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface AppointmentDetailProps {
  appointment: Appointment;
  onUpdate?: () => void;
}

export function AppointmentDetail({
  appointment,
  onUpdate,
}: AppointmentDetailProps) {
  const theme = useTheme();
  const eventColor =
    eventTypeColors[appointment.eventType] ?? theme.textSecondary;
  const { mutate, isLoading } = useUpdateAppointment(appointment.id);
  const [showReschedule, setShowReschedule] = useState(false);

  const isActive = ["scheduled", "confirmed"].includes(appointment.status);

  const handleStatusChange = (status: string, label: string) => {
    Alert.alert(
      `${label} cita`,
      `¿Confirmas que deseas marcar esta cita como "${statusLabels[status]}"?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            const result = await mutate({ status });
            if (result) onUpdate?.();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: eventColor + "10" }]}>
        <View style={[styles.eventBadge, { backgroundColor: eventColor }]}>
          <Icon
            name={eventTypeIcons[appointment.eventType] ?? "calendar"}
            size={22}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.eventLabel, { color: eventColor }]}>
            {eventTypeLabels[appointment.eventType] ?? appointment.eventType}
          </Text>
          <StatusBadge
            label={statusLabels[appointment.status] ?? appointment.status}
            color={statusColors[appointment.status] ?? theme.textSecondary}
          />
        </View>
      </View>

      {/* Time block */}
      <Card>
        <View style={styles.timeBlock}>
          <View style={[styles.timeIconCircle, { backgroundColor: theme.accentLight }]}>
            <Icon name="time" size={20} color={theme.accent} />
          </View>
          <View style={styles.timeInfo}>
            <Text style={[styles.dateText, { color: theme.text }]}>
              {formatFullDate(appointment.scheduledAt)}
            </Text>
            <Text style={[styles.timeRange, { color: theme.textSecondary }]}>
              {formatTime(appointment.scheduledAt)} –{" "}
              {formatEndTime(appointment.scheduledAt, appointment.durationMinutes)}
              {"  ·  "}
              {appointment.durationMinutes} min
            </Text>
          </View>
        </View>
        {/* Duration bar */}
        <View style={[styles.durationBarBg, { backgroundColor: theme.backgroundElement }]}>
          <View
            style={[
              styles.durationBarFill,
              {
                backgroundColor: eventColor,
                width: `${Math.min((appointment.durationMinutes / 120) * 100, 100)}%`,
              },
            ]}
          />
        </View>
      </Card>

      {/* Client */}
      {appointment.customer && (
        <View style={styles.section}>
          <SectionHeader title="Cliente" />
          <Card>
            <View style={styles.clientRow}>
              <Avatar
                uri={undefined}
                size={44}
                borderColor={theme.border}
              />
              <View style={styles.clientInfo}>
                <Text style={[styles.clientName, { color: theme.text }]}>
                  {appointment.customer.firstName}{" "}
                  {appointment.customer.lastName}
                </Text>
                <View style={styles.clientMeta}>
                  {appointment.customer.phone && (
                    <View style={styles.metaRow}>
                      <Icon name="call" size={13} color={theme.textTertiary} />
                      <Text
                        style={[styles.clientPhone, { color: theme.textSecondary }]}
                      >
                        {appointment.customer.phone}
                      </Text>
                    </View>
                  )}
                  {appointment.customer.email && (
                    <View style={styles.metaRow}>
                      <Icon name="mail" size={13} color={theme.textTertiary} />
                      <Text
                        style={[styles.clientPhone, { color: theme.textSecondary }]}
                      >
                        {appointment.customer.email}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Notes */}
      {appointment.comments && (
        <View style={styles.section}>
          <SectionHeader title="Notas" />
          <Card>
            <Text style={[styles.notes, { color: theme.text }]}>
              {appointment.comments}
            </Text>
          </Card>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <SectionHeader title="Acciones" />
        <View style={styles.actions}>
          {isActive && (
            <>
              <IconButton
                icon="checkmark-circle"
                label="Completar"
                variant="accent"
                disabled={isLoading}
                onPress={() => handleStatusChange("completed", "Completar")}
              />
              <IconButton
                icon="calendar"
                label="Reagendar"
                variant="default"
                disabled={isLoading}
                onPress={() => setShowReschedule(true)}
              />
              <IconButton
                icon="close"
                label="Cancelar"
                variant="danger"
                disabled={isLoading}
                onPress={() => handleStatusChange("cancelled", "Cancelar")}
              />
              <IconButton
                icon="alert-circle"
                label="No asistió"
                variant="default"
                disabled={isLoading}
                onPress={() => handleStatusChange("no_show", "No asistió")}
              />
            </>
          )}
          {!isActive && (
            <Text style={[styles.closedText, { color: theme.textSecondary }]}>
              Esta cita ya fue {statusLabels[appointment.status]?.toLowerCase() ?? "cerrada"}.
            </Text>
          )}
        </View>
      </View>

      <RescheduleModal
        visible={showReschedule}
        onClose={() => setShowReschedule(false)}
        appointmentId={appointment.id}
        onSuccess={() => onUpdate?.()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eventLabel: { ...Typography.title3 },
  // Time block
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  timeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timeInfo: {
    flex: 1,
    gap: 2,
  },
  dateText: {
    ...Typography.body,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  timeRange: { ...Typography.subhead },
  durationBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  durationBarFill: {
    height: 4,
    borderRadius: 2,
  },
  // Client
  section: { gap: Spacing.sm },
  clientRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  clientInfo: { flex: 1, gap: 4 },
  clientName: { ...Typography.body, fontWeight: "600" },
  clientMeta: { gap: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: Spacing.xs },
  clientPhone: { ...Typography.caption1 },
  // Notes
  notes: { ...Typography.body, lineHeight: 24 },
  // Actions
  actions: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
  closedText: { ...Typography.body },
});
