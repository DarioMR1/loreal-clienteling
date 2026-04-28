import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { SegmentBadge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing, Typography } from '@/constants/theme';
import { mockFollowUps } from '@/data/mock-clients';
import { useTheme } from '@/hooks/use-theme';
import type { Client, FollowUpType } from '@/types';

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-MX')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

const alertIcons: Record<FollowUpType, IconName> = {
  birthday: 'gift',
  replenishment: 'refresh',
  'special-event': 'sparkles',
  '3-month': 'clipboard',
  '6-month': 'clipboard',
};

interface ClientSummaryProps {
  client: Client;
}

export function ClientSummary({ client }: ClientSummaryProps) {
  const theme = useTheme();
  const alerts = mockFollowUps.filter((f) => f.clientId === client.id && !f.completed);

  return (
    <View style={styles.container}>
      {/* Alerts */}
      {alerts.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Alertas activas" />
          <View style={styles.alertList}>
            {alerts.map((alert) => {
              const days = daysUntil(alert.dueDate);
              const isUrgent = days <= 5;
              return (
                <Card key={alert.id} style={[styles.alertCard, { backgroundColor: isUrgent ? theme.warningLight : theme.backgroundElement }]}>
                  <View style={[styles.alertIconContainer, { backgroundColor: isUrgent ? theme.warning + '20' : theme.accent + '20' }]}>
                    <Icon name={alertIcons[alert.type]} size={18} color={isUrgent ? theme.warning : theme.accent} />
                  </View>
                  <View style={styles.alertInfo}>
                    <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.notes}</Text>
                    <Text style={[styles.alertDate, { color: isUrgent ? theme.warning : theme.textSecondary }]}>
                      {days > 0 ? `En ${days} dias` : days === 0 ? 'Hoy' : `Hace ${Math.abs(days)} dias`}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      )}

      {/* Contact info */}
      <View style={styles.section}>
        <SectionHeader title="Informacion de contacto" />
        <Card>
          <InfoRow icon="call" label="Telefono" value={client.phone} />
          <InfoRow icon="mail" label="Email" value={client.email} />
          <InfoRow icon="calendar" label="Nacimiento" value={formatDate(client.birthDate)} />
          <InfoRow icon="person" label="Genero" value={client.gender === 'female' ? 'Femenino' : client.gender === 'male' ? 'Masculino' : 'Prefiere no decir'} />
          <InfoRow icon="time" label="Cliente desde" value={formatDate(client.registeredAt)} last />
        </Card>
      </View>

      {/* Key metrics */}
      <View style={styles.section}>
        <SectionHeader title="Resumen" />
        <View style={styles.metricsRow}>
          <MiniMetric icon="pricetag" label="Total gastado" value={formatCurrency(client.totalSpent)} theme={theme} />
          <MiniMetric icon="people" label="Visitas" value={`${client.visitCount}`} theme={theme} />
          <MiniMetric icon="star" label="Marca preferida" value={client.preferredBrand} theme={theme} />
        </View>
      </View>

      {/* Consents */}
      <View style={styles.section}>
        <SectionHeader title="Consentimientos" />
        <Card>
          <InfoRow icon="shield-checkmark" label="Aviso de privacidad" value={`v${client.privacyConsent.version} · ${formatDate(client.privacyConsent.date)}`} />
          <View style={styles.consentsRow}>
            <ConsentPill label="SMS" active={client.channelConsents.sms} theme={theme} />
            <ConsentPill label="Email" active={client.channelConsents.email} theme={theme} />
            <ConsentPill label="WhatsApp" active={client.channelConsents.whatsapp} theme={theme} />
          </View>
        </Card>
      </View>
    </View>
  );
}

function InfoRow({ icon, label, value, last }: { icon: IconName; label: string; value: string; last?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderLight }]}>
      <Icon name={icon} size={16} themeColor="textSecondary" />
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function MiniMetric({ icon, label, value, theme }: { icon: IconName; label: string; value: string; theme: ReturnType<typeof useTheme> }) {
  return (
    <Card style={styles.miniMetric}>
      <Icon name={icon} size={18} color={theme.accent} />
      <Text style={[styles.miniValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>{label}</Text>
    </Card>
  );
}

function ConsentPill({ label, active, theme }: { label: string; active: boolean; theme: ReturnType<typeof useTheme> }) {
  return (
    <View style={[styles.consentPill, { backgroundColor: active ? theme.successLight : theme.backgroundElement }]}>
      <Icon name={active ? 'checkmark-circle' : 'close'} size={14} color={active ? theme.success : theme.textTertiary} />
      <Text style={{ color: active ? theme.success : theme.textTertiary, fontSize: 13, fontWeight: '600' }}>
        {label}
      </Text>
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
  alertList: {
    gap: Spacing.sm,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    ...Typography.subhead,
    fontWeight: '500',
  },
  alertDate: {
    ...Typography.caption1,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  infoLabel: {
    ...Typography.subhead,
    flex: 1,
  },
  infoValue: {
    ...Typography.subhead,
    fontWeight: '500',
  },
  consentsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  consentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  miniMetric: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  miniValue: {
    ...Typography.title3,
  },
  miniLabel: {
    ...Typography.caption1,
    textAlign: 'center',
  },
});
