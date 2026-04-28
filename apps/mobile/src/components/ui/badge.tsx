import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ClientSegment } from '@/types';

const segmentLabels: Record<ClientSegment, string> = {
  vip: 'VIP',
  recurrent: 'Recurrente',
  new: 'Nueva',
  'at-risk': 'En riesgo',
};

interface BadgeProps {
  segment: ClientSegment;
}

export function SegmentBadge({ segment }: BadgeProps) {
  const theme = useTheme();
  const color = theme[segment === 'at-risk' ? 'atRisk' : segment === 'new' ? 'new' : segment === 'recurrent' ? 'recurrent' : 'vip'];

  return (
    <View style={[styles.container, { backgroundColor: color + '18' }]}>
      <Text style={[styles.label, { color }]}>{segmentLabels[segment]}</Text>
    </View>
  );
}

interface StatusBadgeProps {
  label: string;
  color: string;
}

export function StatusBadge({ label, color }: StatusBadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: color + '18' }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.caption1,
    fontWeight: '600',
  },
});
