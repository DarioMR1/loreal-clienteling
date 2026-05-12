import React, { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SegmentBadge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useClients } from "@/features/client-book/hooks/use-clients";
import type { Customer } from "@/types";

function daysUntilBirthday(birthDate: string): number {
  const today = new Date();
  const bday = new Date(birthDate);
  const thisYear = new Date(
    today.getFullYear(),
    bday.getMonth(),
    bday.getDate()
  );
  if (thisYear < today) {
    thisYear.setFullYear(today.getFullYear() + 1);
  }
  return Math.ceil(
    (thisYear.getTime() - today.getTime()) / 86_400_000
  );
}

function daysSinceContact(lastContact: string | null): number {
  if (!lastContact) return 999;
  return Math.floor(
    (Date.now() - new Date(lastContact).getTime()) / 86_400_000
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

export function FollowUpsScreen() {
  const theme = useTheme();
  const { data: clients, isLoading } = useClients();

  const { birthdays, inactive, atRisk } = useMemo(() => {
    if (!clients) return { birthdays: [], inactive: [], atRisk: [] };

    const bdays: (Customer & { _daysUntil: number })[] = [];
    const inact: (Customer & { _daysSince: number })[] = [];
    const risk: Customer[] = [];

    for (const c of clients) {
      // Upcoming birthdays (next 30 days)
      if (c.birthDate) {
        const days = daysUntilBirthday(c.birthDate);
        if (days <= 30) {
          bdays.push({ ...c, _daysUntil: days });
        }
      }

      // No contact in 90+ days
      const since = daysSinceContact(c.lastContactAt);
      if (since >= 90) {
        inact.push({ ...c, _daysSince: since });
      }

      // At risk segment
      if (c.lifecycleSegment === "at_risk") {
        risk.push(c);
      }
    }

    bdays.sort((a, b) => a._daysUntil - b._daysUntil);
    inact.sort((a, b) => b._daysSince - a._daysSince);

    return { birthdays: bdays, inactive: inact, atRisk: risk };
  }, [clients]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundSecondary }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const totalAlerts = birthdays.length + inactive.length + atRisk.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: theme.text }]}>
        Seguimientos
      </Text>
      <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
        {totalAlerts} pendientes de atención
      </Text>

      {/* Birthdays */}
      <SectionHeader title={`Cumpleaños próximos (${birthdays.length})`} />
      {birthdays.length === 0 ? (
        <Card>
          <View style={styles.emptyRow}>
            <Icon name="gift" size={18} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Sin cumpleaños en los próximos 30 días.
            </Text>
          </View>
        </Card>
      ) : (
        birthdays.map((c) => (
          <Card key={c.id}>
            <View style={styles.row}>
              <Icon name="gift" size={18} color={theme.accent} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowName, { color: theme.text }]}>
                  {c.firstName} {c.lastName}
                </Text>
                <Text style={[styles.rowMeta, { color: theme.textSecondary }]}>
                  {formatDate(c.birthDate!)} ·{" "}
                  {c._daysUntil === 0
                    ? "Hoy"
                    : c._daysUntil === 1
                      ? "Mañana"
                      : `En ${c._daysUntil} días`}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}

      {/* No contact */}
      <SectionHeader title={`Sin contacto reciente (${inactive.length})`} />
      {inactive.length === 0 ? (
        <Card>
          <View style={styles.emptyRow}>
            <Icon name="time" size={18} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Todas las clientas tienen contacto reciente.
            </Text>
          </View>
        </Card>
      ) : (
        inactive.slice(0, 10).map((c) => (
          <Card key={c.id}>
            <View style={styles.row}>
              <Icon name="time" size={18} color={theme.warning} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowName, { color: theme.text }]}>
                  {c.firstName} {c.lastName}
                </Text>
                <Text style={[styles.rowMeta, { color: theme.textSecondary }]}>
                  Último contacto: hace {c._daysSince} días
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}

      {/* At risk */}
      <SectionHeader title={`En riesgo (${atRisk.length})`} />
      {atRisk.length === 0 ? (
        <Card>
          <View style={styles.emptyRow}>
            <Icon name="alert-circle" size={18} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Sin clientas en riesgo.
            </Text>
          </View>
        </Card>
      ) : (
        atRisk.map((c) => (
          <Card key={c.id}>
            <View style={styles.row}>
              <Icon name="alert-circle" size={18} color={theme.warning} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowName, { color: theme.text }]}>
                  {c.firstName} {c.lastName}
                </Text>
              </View>
              <SegmentBadge segment="at_risk" />
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  content: {
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingBottom: Spacing["4xl"],
  },
  pageTitle: { ...Typography.title2 },
  pageSubtitle: { ...Typography.subhead, marginTop: -Spacing.sm },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyText: { ...Typography.body },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  rowInfo: { flex: 1, gap: 2 },
  rowName: { ...Typography.body, fontWeight: "600" },
  rowMeta: { ...Typography.caption1 },
});
