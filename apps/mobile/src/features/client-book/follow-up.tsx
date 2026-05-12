import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Customer, Consent, Communication } from "@/types";

const followUpLabels: Record<string, string> = {
  "3_months": "3 meses",
  "6_months": "6 meses",
  birthday: "Cumpleaños",
  replenishment: "Reposición",
  special_event: "Evento especial",
  custom: "Personalizado",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

interface Props {
  customer: Customer;
  consents: Consent[];
  communications: Communication[];
}

export function FollowUpView({ customer, consents, communications }: Props) {
  const theme = useTheme();

  const hasConsent = (type: string) =>
    consents.some((c) => c.type === type && !c.revokedAt);

  const canWhatsApp = hasConsent("marketing_whatsapp");
  const canSMS = hasConsent("marketing_sms");
  const canEmail = hasConsent("marketing_email");

  // Recent communications sorted by date
  const recentComms = [...communications]
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .slice(0, 10);

  return (
    <View style={styles.container}>
      {/* Quick actions */}
      <SectionHeader title="Enviar seguimiento" />
      <View style={styles.actionsRow}>
        <IconButton
          icon="chatbubble"
          label="WhatsApp"
          variant={canWhatsApp ? "accent" : "default"}
          disabled={!canWhatsApp}
        />
        <IconButton
          icon="chatbubble-ellipses"
          label="SMS"
          variant={canSMS ? "accent" : "default"}
          disabled={!canSMS}
        />
        <IconButton
          icon="mail"
          label="Email"
          variant={canEmail ? "accent" : "default"}
          disabled={!canEmail}
        />
      </View>

      {!canWhatsApp && !canSMS && !canEmail && (
        <Text style={[styles.noConsent, { color: theme.warning }]}>
          La clienta no tiene consentimientos activos para comunicación.
        </Text>
      )}

      {/* Message history */}
      <SectionHeader title="Historial de comunicaciones" />
      {recentComms.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Sin comunicaciones registradas.
        </Text>
      ) : (
        recentComms.map((comm) => (
          <Card key={comm.id}>
            <View style={styles.commRow}>
              <Icon
                name={
                  comm.channel === "whatsapp"
                    ? "logo-whatsapp"
                    : comm.channel === "sms"
                      ? "chatbubble"
                      : "mail"
                }
                size={18}
                color={theme.textSecondary}
              />
              <View style={styles.commInfo}>
                <View style={styles.commTitleRow}>
                  <StatusBadge
                    label={
                      followUpLabels[comm.followupType ?? ""] ??
                      comm.followupType ??
                      "—"
                    }
                    color={theme.info}
                  />
                  <Text
                    style={[styles.commDate, { color: theme.textTertiary }]}
                  >
                    {formatDate(comm.sentAt)}
                  </Text>
                </View>
                <Text
                  style={[styles.commBody, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {comm.body}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.lg },
  actionsRow: { flexDirection: "row", gap: Spacing.sm },
  noConsent: { ...Typography.caption1, marginTop: -Spacing.sm },
  emptyText: { ...Typography.body },
  commRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  commInfo: { flex: 1, gap: 4 },
  commTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commDate: { ...Typography.caption1 },
  commBody: { ...Typography.body },
});
