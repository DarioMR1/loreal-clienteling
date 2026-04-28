import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/badge';
import { Spacing, Typography } from '@/constants/theme';
import { eventTypeColors, eventTypeLabels, mockAppointments } from '@/data/mock-appointments';
import { useTheme } from '@/hooks/use-theme';
import type { Appointment } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
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

interface AppointmentListProps {
  selectedId: string | null;
  onSelect: (appointment: Appointment) => void;
}

export function AppointmentList({ selectedId, onSelect }: AppointmentListProps) {
  const theme = useTheme();
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  const today = new Date().toISOString().split('T')[0];
  const filtered = useMemo(() => {
    return mockAppointments
      .filter((a) => (filter === 'upcoming' ? a.date >= today : a.date < today))
      .sort((a, b) => (filter === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [filter, today]);

  const renderItem = ({ item }: { item: Appointment }) => {
    const isSelected = item.id === selectedId;
    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={[
          styles.row,
          { borderBottomColor: theme.borderLight },
          isSelected && { backgroundColor: theme.backgroundElement },
        ]}
      >
        <View style={[styles.timeStrip, { backgroundColor: eventTypeColors[item.eventType] + '20' }]}>
          <Text style={[styles.time, { color: eventTypeColors[item.eventType] }]}>{item.time}</Text>
          <Text style={[styles.endTime, { color: theme.textTertiary }]}>{item.endTime}</Text>
        </View>
        <Avatar uri={item.client.photoUrl} size={40} />
        <View style={styles.info}>
          <Text style={[styles.clientName, { color: theme.text }]} numberOfLines={1}>
            {item.client.firstName} {item.client.lastName}
          </Text>
          <Text style={[styles.eventType, { color: theme.textSecondary }]}>
            {eventTypeLabels[item.eventType]}
          </Text>
        </View>
        <StatusBadge label={statusLabels[item.status]} color={statusColors[item.status]} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Appointments</Text>
      </View>

      {/* Filter toggle */}
      <View style={[styles.filterRow, { backgroundColor: theme.backgroundElement }]}>
        <Pressable
          onPress={() => setFilter('upcoming')}
          style={[styles.filterTab, filter === 'upcoming' && { backgroundColor: theme.background }]}
        >
          <Text style={[styles.filterLabel, { color: filter === 'upcoming' ? theme.text : theme.textSecondary }]}>Próximas</Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('past')}
          style={[styles.filterTab, filter === 'past' && { backgroundColor: theme.background }]}
        >
          <Text style={[styles.filterLabel, { color: filter === 'past' ? theme.text : theme.textSecondary }]}>Pasadas</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.title2,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterLabel: {
    ...Typography.subhead,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  timeStrip: {
    width: 52,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  time: {
    ...Typography.subhead,
    fontWeight: '700',
  },
  endTime: {
    ...Typography.caption2,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    ...Typography.body,
    fontWeight: '600',
  },
  eventType: {
    ...Typography.caption1,
  },
});
