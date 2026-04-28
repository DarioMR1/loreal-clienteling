import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing, Typography } from '@/constants/theme';
import { mockActivities } from '@/data/mock-clients';
import { useTheme } from '@/hooks/use-theme';
import type { Activity, ActivityType } from '@/types';

const activityIcons: Record<ActivityType, IconName> = {
  purchase: 'bag',
  recommendation: 'sparkles',
  appointment: 'calendar',
  'follow-up': 'clipboard',
  message: 'chatbubble',
  sample: 'gift',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

interface ActivityFeedProps {
  clientId: string;
}

export function ActivityFeed({ clientId }: ActivityFeedProps) {
  const theme = useTheme();
  const activities = mockActivities.filter((a) => a.clientId === clientId);

  const renderItem = ({ item, index }: { item: Activity; index: number }) => {
    const isLast = index === activities.length - 1;
    return (
      <View style={styles.row}>
        {/* Timeline line */}
        <View style={styles.timelineCol}>
          <View style={[styles.dot, { backgroundColor: theme.accent + '20' }]}>
            <Icon name={activityIcons[item.type]} size={14} color={theme.accent} />
          </View>
          {!isLast && <View style={[styles.line, { backgroundColor: theme.borderLight }]} />}
        </View>

        {/* Content */}
        <View style={[styles.content, !isLast && { paddingBottom: Spacing.lg }]}>
          <View style={styles.contentHeader}>
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.date, { color: theme.textTertiary }]}>{formatDate(item.date)}</Text>
          </View>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  timelineCol: {
    width: 40,
    alignItems: 'center',
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingLeft: Spacing.md,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.subhead,
    fontWeight: '600',
  },
  date: {
    ...Typography.caption1,
  },
  subtitle: {
    ...Typography.caption1,
    marginTop: 2,
  },
});
