import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { Spacing, Typography } from '@/constants/theme';
import { mockFollowUps, mockMessages } from '@/data/mock-clients';
import { useTheme } from '@/hooks/use-theme';
import type { Client, FollowUpType, MessageChannel } from '@/types';

const followUpLabels: Record<FollowUpType, string> = {
  '3-month': '3 Meses',
  '6-month': '6 Meses',
  birthday: 'Cumpleanos',
  replenishment: 'Reposicion',
  'special-event': 'Evento Especial',
};

const channelIcons: Record<MessageChannel, IconName> = {
  whatsapp: 'chatbubble',
  sms: 'phone-portrait',
  email: 'mail',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface FollowUpViewProps {
  client: Client;
}

export function FollowUpView({ client }: FollowUpViewProps) {
  const theme = useTheme();
  const followUps = mockFollowUps.filter((f) => f.clientId === client.id);
  const messages = mockMessages.filter((m) => m.clientId === client.id);

  return (
    <View style={styles.container}>
      {/* Quick actions */}
      <View style={styles.section}>
        <SectionHeader title="Enviar mensaje" />
        <View style={styles.quickActions}>
          {client.channelConsents.whatsapp && (
            <IconButton icon="whatsapp" label="WhatsApp" variant="accent" />
          )}
          {client.channelConsents.sms && (
            <IconButton icon="phone-portrait" label="SMS" variant="default" />
          )}
          {client.channelConsents.email && (
            <IconButton icon="mail" label="Email" variant="default" />
          )}
        </View>
      </View>

      {/* Message templates */}
      <View style={styles.section}>
        <SectionHeader title="Plantillas disponibles" />
        <View style={styles.templateGrid}>
          {[
            { label: 'Seguimiento post-compra', icon: 'bag' as IconName },
            { label: 'Feliz cumpleanos', icon: 'gift' as IconName },
            { label: 'Promocion exclusiva', icon: 'pricetag' as IconName },
            { label: 'Reposicion de producto', icon: 'refresh' as IconName },
          ].map((tpl) => (
            <Pressable key={tpl.label} style={[styles.templateCard, { backgroundColor: theme.backgroundElement }]}>
              <Icon name={tpl.icon} size={16} themeColor="textSecondary" />
              <Text style={[styles.templateName, { color: theme.text }]}>{tpl.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Pending follow-ups */}
      {followUps.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Seguimientos pendientes" />
          {followUps.map((fu) => (
            <Card key={fu.id} style={styles.fuCard}>
              <View style={styles.fuHeader}>
                <StatusBadge label={followUpLabels[fu.type]} color={theme.accent} />
                <Text style={[styles.fuDate, { color: theme.textSecondary }]}>{formatDate(fu.dueDate)}</Text>
              </View>
              <Text style={[styles.fuNotes, { color: theme.text }]}>{fu.notes}</Text>
            </Card>
          ))}
        </View>
      )}

      {/* Message history */}
      {messages.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Historial de mensajes" />
          {messages.map((msg) => (
            <Card key={msg.id} style={styles.msgCard}>
              <View style={styles.msgHeader}>
                <Icon name={channelIcons[msg.channel]} size={16} themeColor="textSecondary" />
                <Text style={[styles.msgTemplate, { color: theme.text }]}>{msg.templateName}</Text>
                <Text style={[styles.msgDate, { color: theme.textTertiary }]}>{formatDate(msg.sentAt)}</Text>
              </View>
              <Text style={[styles.msgContent, { color: theme.textSecondary }]} numberOfLines={2}>
                {msg.content}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 10,
  },
  templateName: {
    ...Typography.subhead,
    fontWeight: '500',
  },
  fuCard: {
    gap: Spacing.sm,
  },
  fuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fuDate: {
    ...Typography.caption1,
  },
  fuNotes: {
    ...Typography.subhead,
  },
  msgCard: {
    gap: Spacing.sm,
  },
  msgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  msgTemplate: {
    ...Typography.subhead,
    fontWeight: '600',
    flex: 1,
  },
  msgDate: {
    ...Typography.caption1,
  },
  msgContent: {
    ...Typography.caption1,
  },
});
