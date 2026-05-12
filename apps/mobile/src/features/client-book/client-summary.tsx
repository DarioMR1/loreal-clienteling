import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Customer, Purchase, Consent, Communication } from "@/types";

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("es-MX", { minimumFractionDigits: 0 });
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  customer: Customer;
  purchases: Purchase[];
  consents: Consent[];
  communications: Communication[];
}

export function ClientSummary({
  customer,
  purchases,
  consents,
  communications,
}: Props) {
  const theme = useTheme();

  const totalSpent = purchases.reduce(
    (sum, p) => sum + Number(p.totalAmount),
    0
  );
  const hasConsent = (type: string) =>
    consents.some((c) => c.type === type && !c.revokedAt);

  return (
    <View style={styles.container}>
      <SectionHeader title="Información de contacto" />
      <Card>
        <InfoRow icon="call" label="Teléfono" value={customer.phone ?? "—"} />
        <InfoRow icon="mail" label="Email" value={customer.email ?? "—"} />
        <InfoRow
          icon="gift"
          label="Cumpleaños"
          value={formatDate(customer.birthDate)}
        />
        <InfoRow
          icon="calendar"
          label="Registrada"
          value={formatDate(customer.customerSince)}
        />
        <InfoRow
          icon="time"
          label="Último contacto"
          value={formatDate(customer.lastContactAt)}
        />
      </Card>

      <SectionHeader title="Métricas clave" />
      <View style={styles.metricsRow}>
        <MiniMetric label="Total gastado" value={formatCurrency(totalSpent)} />
        <MiniMetric label="Compras" value={String(purchases.length)} />
        <MiniMetric
          label="Comunicaciones"
          value={String(communications.length)}
        />
      </View>

      <SectionHeader title="Consentimientos" />
      <Card>
        <View style={styles.consentsRow}>
          <ConsentPill channel="SMS" active={hasConsent("marketing_sms")} />
          <ConsentPill channel="Email" active={hasConsent("marketing_email")} />
          <ConsentPill
            channel="WhatsApp"
            active={hasConsent("marketing_whatsapp")}
          />
          <ConsentPill
            channel="Privacidad"
            active={hasConsent("privacy_notice")}
          />
        </View>
      </Card>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={16} color={theme.textTertiary} />
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[styles.infoValue, { color: theme.text }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <Card style={styles.miniMetric}>
      <Text style={[styles.miniMetricValue, { color: theme.text }]}>
        {value}
      </Text>
      <Text style={[styles.miniMetricLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
    </Card>
  );
}

function ConsentPill({
  channel,
  active,
}: {
  channel: string;
  active: boolean;
}) {
  const theme = useTheme();
  return (
    <StatusBadge
      label={channel}
      color={active ? theme.success : theme.textTertiary}
    />
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.lg },
  metricsRow: { flexDirection: "row", gap: Spacing.sm },
  miniMetric: { flex: 1, alignItems: "center" },
  miniMetricValue: { ...Typography.title3 },
  miniMetricLabel: { ...Typography.caption1, marginTop: 2 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  infoLabel: { ...Typography.caption1, width: 100 },
  infoValue: { ...Typography.body, flex: 1 },
  consentsRow: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
});
