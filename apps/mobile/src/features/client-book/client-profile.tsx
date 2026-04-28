import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { SegmentBadge } from '@/components/ui/badge';
import { TabBar } from '@/components/ui/tab-bar';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Client } from '@/types';

import { ActivityFeed } from './activity-feed';
import { BeautyProfileView } from './beauty-profile';
import { ClientSummary } from './client-summary';
import { FollowUpView } from './follow-up';
import { Recommendations } from './recommendations';

const profileTabs = [
  { key: 'summary', label: 'Resumen' },
  { key: 'beauty', label: 'Belleza' },
  { key: 'history', label: 'Historial' },
  { key: 'recommendations', label: 'Recomendaciones' },
  { key: 'follow-up', label: 'Seguimiento' },
];

interface ClientProfileProps {
  client: Client;
}

export function ClientProfile({ client }: ClientProfileProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('summary');

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return <ClientSummary client={client} />;
      case 'beauty':
        return <BeautyProfileView client={client} />;
      case 'history':
        return <ActivityFeed clientId={client.id} />;
      case 'recommendations':
        return <Recommendations client={client} />;
      case 'follow-up':
        return <FollowUpView client={client} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerTop}>
          <Avatar
            uri={client.photoUrl}
            size={64}
            borderColor={theme[client.segment === 'vip' ? 'vip' : client.segment === 'at-risk' ? 'atRisk' : 'border']}
          />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: theme.text }]}>
                {client.firstName} {client.lastName}
              </Text>
              <SegmentBadge segment={client.segment} />
            </View>
            <Text style={[styles.meta, { color: theme.textSecondary }]}>
              {client.phone}  ·  {client.email}
            </Text>
            <Text style={[styles.meta, { color: theme.textTertiary }]}>
              {client.preferredBrand}  ·  {client.visitCount} visitas
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <TabBar tabs={profileTabs} activeTab={activeTab} onTabPress={setActiveTab} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.title2,
  },
  meta: {
    ...Typography.subhead,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
});
