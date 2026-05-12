import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Appointment } from "@/types";

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

const eventIcons: Record<string, IconName> = {
  facial: "sparkles",
  cabin_service: "star",
  anniversary_event: "ribbon",
  vip_cabin: "star",
  product_followup: "clipboard",
  custom: "calendar",
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

interface AppointmentDetailProps {
  appointment: Appointment;
}

export function AppointmentDetail({ appointment }: AppointmentDetailProps) {
  const theme = useTheme();
  const eventColor =
    eventTypeColors[appointment.eventType] ?? theme.textSecondary;

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
            name={eventIcons[appointment.eventType] ?? "calendar"}
            size={22}
            color="#FFFFFF"
          />
        </View>
        <Text style={[styles.eventLabel, { color: eventColor }]}>
          {eventTypeLabels[appointment.eventType] ?? appointment.eventType}
        </Text>
        <StatusBadge
          label={statusLabels[appointment.status] ?? appointment.status}
          color={statusColors[appointment.status] ?? theme.textSecondary}
        />
      </View>

      {/* Date & time */}
      <Card>
        <View style={styles.dateRow}>
          <Icon name="calendar" size={22} themeColor="accent" />
          <View>
            <Text style={[styles.dateText, { color: theme.text }]}>
              {formatFullDate(appointment.scheduledAt)}
            </Text>
            <Text style={[styles.timeText, { color: theme.textSecondary }]}>
              {formatTime(appointment.scheduledAt)} ·{" "}
              {appointment.durationMinutes} min
            </Text>
          </View>
        </View>
      </Card>

      {/* Client */}
      {appointment.customer && (
        <View style={styles.section}>
          <SectionHeader title="Cliente" />
          <Card>
            <View style={styles.clientRow}>
              <View style={styles.clientInfo}>
                <Text style={[styles.clientName, { color: theme.text }]}>
                  {appointment.customer.firstName}{" "}
                  {appointment.customer.lastName}
                </Text>
                <Text
                  style={[styles.clientPhone, { color: theme.textSecondary }]}
                >
                  {appointment.customer.phone ?? "Sin teléfono"}
                </Text>
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
          <IconButton
            icon="chatbubble"
            label="Enviar recordatorio"
            variant="accent"
          />
          <IconButton
            icon="calendar"
            label="Reagendar"
            variant="default"
          />
          <IconButton icon="close" label="Cancelar" variant="danger" />
        </View>
      </View>
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
    borderRadius: 16,
  },
  eventBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eventLabel: { ...Typography.title3, flex: 1 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  dateText: {
    ...Typography.body,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  timeText: { ...Typography.subhead, marginTop: 2 },
  section: { gap: Spacing.sm },
  clientRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  clientInfo: { flex: 1 },
  clientName: { ...Typography.body, fontWeight: "600" },
  clientPhone: { ...Typography.subhead },
  notes: { ...Typography.body, lineHeight: 24 },
  actions: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
});
