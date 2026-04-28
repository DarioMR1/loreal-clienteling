import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { Spacing, Typography } from '@/constants/theme';
import { eventTypeColors, eventTypeLabels } from '@/data/mock-appointments';
import { useTheme } from '@/hooks/use-theme';
import type { Appointment, EventType } from '@/types';

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmada',
  rescheduled: 'Reagendada',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

const statusColors: Record<string, string> = {
  confirmed: '#2E7D32',
  rescheduled: '#F57C00',
  cancelled: '#C62828',
  completed: '#1565C0',
};

const eventIcons: Record<EventType, IconName> = {
  'facial': 'sparkles',
  'cabin-service': 'star',
  'virtual-consultation': 'videocam',
  'anniversary-event': 'ribbon',
  'vip-cabin': 'star',
  'product-follow-up': 'clipboard',
};

interface AppointmentDetailProps {
  appointment: Appointment;
}

export function AppointmentDetail({ appointment }: AppointmentDetailProps) {
  const theme = useTheme();
  const eventColor = eventTypeColors[appointment.eventType];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: eventColor + '10' }]}>
        <View style={[styles.eventBadge, { backgroundColor: eventColor }]}>
          <Icon name={eventIcons[appointment.eventType]} size={22} color="#FFFFFF" />
        </View>
        <Text style={[styles.eventLabel, { color: eventColor }]}>
          {eventTypeLabels[appointment.eventType]}
        </Text>
        <StatusBadge label={statusLabels[appointment.status]} color={statusColors[appointment.status]} />
      </View>

      {/* Date & time */}
      <Card>
        <View style={styles.dateRow}>
          <Icon name="calendar" size={22} themeColor="accent" />
          <View>
            <Text style={[styles.dateText, { color: theme.text }]}>{formatFullDate(appointment.date)}</Text>
            <Text style={[styles.timeText, { color: theme.textSecondary }]}>{appointment.time} — {appointment.endTime}</Text>
          </View>
        </View>
      </Card>

      {/* Client */}
      <View style={styles.section}>
        <SectionHeader title="Cliente" />
        <Card>
          <View style={styles.clientRow}>
            <Avatar uri={appointment.client.photoUrl} size={48} />
            <View style={styles.clientInfo}>
              <Text style={[styles.clientName, { color: theme.text }]}>
                {appointment.client.firstName} {appointment.client.lastName}
              </Text>
              <Text style={[styles.clientPhone, { color: theme.textSecondary }]}>
                {appointment.client.phone}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <SectionHeader title="Notas" />
        <Card>
          <Text style={[styles.notes, { color: theme.text }]}>{appointment.notes}</Text>
        </Card>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <SectionHeader title="Acciones" />
        <View style={styles.actions}>
          <IconButton icon="chatbubble" label="Enviar recordatorio" variant="accent" />
          <IconButton icon="calendar" label="Reagendar" variant="default" />
          <IconButton icon="close" label="Cancelar" variant="danger" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 16,
  },
  eventBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventLabel: {
    ...Typography.title3,
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dateText: {
    ...Typography.body,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timeText: {
    ...Typography.subhead,
    marginTop: 2,
  },
  section: {
    gap: Spacing.sm,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    ...Typography.body,
    fontWeight: '600',
  },
  clientPhone: {
    ...Typography.subhead,
  },
  notes: {
    ...Typography.body,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
});
