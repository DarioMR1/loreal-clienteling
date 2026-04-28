import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { SalesMetric } from '@/types';

function formatValue(value: number, unit: SalesMetric['unit']): string {
  switch (unit) {
    case 'currency':
      return `$${value.toLocaleString('es-MX')}`;
    case 'percent':
      return `${value}%`;
    default:
      return value.toString();
  }
}

interface MetricCardProps {
  metric: SalesMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const theme = useTheme();
  const progress = Math.min(metric.value / metric.target, 1);
  const isOnTrack = progress >= 0.7;

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderColor: theme.borderLight }]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{metric.label}</Text>
      <Text style={[styles.value, { color: theme.text }]}>
        {formatValue(metric.value, metric.unit)}
      </Text>
      <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: isOnTrack ? theme.success : theme.warning,
            },
          ]}
        />
      </View>
      <Text style={[styles.target, { color: theme.textTertiary }]}>
        Meta: {formatValue(metric.target, metric.unit)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    minWidth: 160,
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption1,
    fontWeight: '500',
  },
  value: {
    ...Typography.title2,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  target: {
    ...Typography.caption2,
    marginTop: 2,
  },
});
