import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Recommendation } from "@/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: Props) {
  const theme = useTheme();

  if (recommendations.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="sparkles" size={32} color={theme.textTertiary} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Sin recomendaciones registradas.
        </Text>
      </View>
    );
  }

  const converted = recommendations.filter((r) => r.convertedToPurchase);
  const pending = recommendations.filter((r) => !r.convertedToPurchase);

  return (
    <View style={styles.container}>
      {/* Conversion summary */}
      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: theme.text }]}>
            {recommendations.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Total
          </Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: theme.success }]}>
            {converted.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Convertidas
          </Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: theme.accent }]}>
            {pending.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            Pendientes
          </Text>
        </Card>
      </View>

      {/* List */}
      <SectionHeader title="Historial de recomendaciones" />
      {recommendations.map((rec) => (
        <Card key={rec.id}>
          <View style={styles.recRow}>
            <View style={styles.recInfo}>
              <View style={styles.recTitleRow}>
                <Text style={[styles.recSource, { color: theme.textSecondary }]}>
                  {rec.source === "ai_suggested"
                    ? "IA"
                    : rec.source === "replenishment_alert"
                      ? "Reposición"
                      : "Manual"}
                </Text>
                <Text style={[styles.recDate, { color: theme.textTertiary }]}>
                  {formatDate(rec.recommendedAt)}
                </Text>
              </View>
              {rec.product && (
                <Text
                  style={[styles.recProductName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {rec.product.name}
                </Text>
              )}
              {rec.notes && (
                <Text
                  style={[styles.recNotes, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {rec.notes}
                </Text>
              )}
              {rec.visitReason && (
                <Text
                  style={[styles.recReason, { color: theme.textTertiary }]}
                >
                  Motivo: {rec.visitReason}
                </Text>
              )}
            </View>
            <StatusBadge
              label={rec.convertedToPurchase ? "Convertida" : "Pendiente"}
              color={rec.convertedToPurchase ? theme.success : theme.accent}
            />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.lg },
  empty: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyText: { ...Typography.body },
  summaryRow: { flexDirection: "row", gap: Spacing.sm },
  summaryCard: { flex: 1, alignItems: "center" },
  summaryValue: { ...Typography.title2 },
  summaryLabel: { ...Typography.caption1, marginTop: 2 },
  recRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  recInfo: { flex: 1, gap: 2 },
  recTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recProductName: { ...Typography.body, fontWeight: "600", marginTop: 2 },
  recSource: { ...Typography.subhead, fontWeight: "600" },
  recDate: { ...Typography.caption1 },
  recNotes: { ...Typography.body, marginTop: 2 },
  recReason: { ...Typography.caption1, marginTop: 2 },
});
