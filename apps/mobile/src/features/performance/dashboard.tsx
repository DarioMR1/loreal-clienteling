import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { MetricCard } from '@/components/ui/metric-card';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing, Typography } from '@/constants/theme';
import { mockMetrics, monthlyTrend, salesByCategory, topBrands, weeklyAppointmentMetrics } from '@/data/mock-advisor';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/hooks/use-theme';

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-MX')}`;
}

export function Dashboard() {
  const theme = useTheme();
  const { session } = useAuth();
  const user = session?.user;
  const firstName = (user?.fullName ?? user?.name ?? '').split(' ')[0];
  const userImage = user?.image ?? undefined;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Avatar uri={userImage} size={48} />
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>Hola, {firstName}</Text>
          <Text style={[styles.store, { color: theme.textSecondary }]}>{user?.email ?? ''}</Text>
        </View>
      </View>

      {/* KPI Grid */}
      <View style={styles.section}>
        <SectionHeader title="KPIs del mes" />
        <View style={styles.metricsGrid}>
          {mockMetrics.map((m) => (
            <MetricCard key={m.label} metric={m} />
          ))}
        </View>
      </View>

      {/* Appointment metrics */}
      <View style={styles.section}>
        <SectionHeader title="Citas de la semana" />
        <Card>
          <View style={styles.aptMetrics}>
            <AptMetric label="Meta" value={weeklyAppointmentMetrics.target} theme={theme} />
            <AptMetric label="Total" value={weeklyAppointmentMetrics.total} theme={theme} />
            <AptMetric label="Nuevas" value={weeklyAppointmentMetrics.new} theme={theme} />
            <AptMetric label="Reagendadas" value={weeklyAppointmentMetrics.rescheduled} theme={theme} />
          </View>
        </Card>
      </View>

      {/* Top brands */}
      <View style={styles.section}>
        <SectionHeader title="Top Marcas" />
        <Card>
          {topBrands.map((b, i) => (
            <View key={b.brand} style={[styles.brandRow, i < topBrands.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderLight }]}>
              <Text style={[styles.brandRank, { color: theme.textTertiary }]}>{i + 1}</Text>
              <Text style={[styles.brandName, { color: theme.text }]}>{b.brand}</Text>
              <Text style={[styles.brandSales, { color: theme.accent }]}>{formatCurrency(b.sales)}</Text>
              <View style={[styles.barTrack, { backgroundColor: theme.backgroundElement }]}>
                <View style={[styles.barFill, { width: `${b.percentage}%`, backgroundColor: theme.accent }]} />
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* Sales by category */}
      <View style={styles.section}>
        <SectionHeader title="Ventas por Categoria" />
        <Card>
          {salesByCategory.map((c, i) => (
            <View key={c.category} style={[styles.catRow, i < salesByCategory.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderLight }]}>
              <View style={styles.catInfo}>
                <Text style={[styles.catName, { color: theme.text }]}>{c.category}</Text>
                <Text style={[styles.catSales, { color: theme.textSecondary }]}>{formatCurrency(c.sales)}</Text>
              </View>
              <Text style={[styles.catPercent, { color: theme.accent }]}>{c.percentage}%</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Monthly trend */}
      <View style={styles.section}>
        <SectionHeader title="Tendencia mensual" />
        <Card>
          <View style={styles.trendRow}>
            {monthlyTrend.map((m) => {
              const max = Math.max(...monthlyTrend.map((t) => t.value));
              const height = (m.value / max) * 80;
              return (
                <View key={m.month} style={styles.trendCol}>
                  <View style={[styles.trendBar, { height, backgroundColor: theme.accent }]} />
                  <Text style={[styles.trendLabel, { color: theme.textSecondary }]}>{m.month}</Text>
                  <Text style={[styles.trendValue, { color: theme.textTertiary }]}>{formatCurrency(m.value)}</Text>
                </View>
              );
            })}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function AptMetric({ label, value, theme }: { label: string; value: number; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={styles.aptMetric}>
      <Text style={[styles.aptValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.aptLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
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
    gap: Spacing.lg,
  },
  greeting: {
    ...Typography.title2,
  },
  store: {
    ...Typography.subhead,
    marginTop: 2,
  },
  section: {
    gap: Spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  aptMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  aptMetric: {
    alignItems: 'center',
    gap: 2,
  },
  aptValue: {
    ...Typography.title2,
  },
  aptLabel: {
    ...Typography.caption1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  brandRank: {
    ...Typography.caption1,
    fontWeight: '700',
    width: 20,
  },
  brandName: {
    ...Typography.subhead,
    fontWeight: '500',
    width: 120,
  },
  brandSales: {
    ...Typography.subhead,
    fontWeight: '600',
    width: 80,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  catInfo: {
    gap: 2,
  },
  catName: {
    ...Typography.body,
    fontWeight: '600',
  },
  catSales: {
    ...Typography.caption1,
  },
  catPercent: {
    ...Typography.title3,
    fontWeight: '700',
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: Spacing.lg,
  },
  trendCol: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  trendBar: {
    width: 32,
    borderRadius: 4,
  },
  trendLabel: {
    ...Typography.caption1,
    fontWeight: '600',
  },
  trendValue: {
    ...Typography.caption2,
  },
});
