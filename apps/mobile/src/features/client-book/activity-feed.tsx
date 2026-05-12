import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Purchase, Recommendation, Communication, Sample } from "@/types";

interface ActivityItem {
  id: string;
  type: "purchase" | "recommendation" | "communication" | "sample";
  date: string;
  title: string;
  subtitle: string;
}

const activityIcons: Record<string, IconName> = {
  purchase: "bag",
  recommendation: "sparkles",
  communication: "chatbubble",
  sample: "gift",
};

const activityColors: Record<string, string> = {
  purchase: "#4A7C59",
  recommendation: "#C9A96E",
  communication: "#5B7FA5",
  sample: "#D4A017",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  purchases: Purchase[];
  recommendations: Recommendation[];
  communications: Communication[];
  samples: Sample[];
}

export function ActivityFeed({
  purchases,
  recommendations,
  communications,
  samples,
}: Props) {
  const theme = useTheme();

  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    for (const p of purchases) {
      items.push({
        id: `p-${p.id}`,
        type: "purchase",
        date: p.purchasedAt,
        title: "Compra registrada",
        subtitle: `$${Number(p.totalAmount).toLocaleString("es-MX")} · ${p.items?.length ?? 0} productos`,
      });
    }

    for (const r of recommendations) {
      items.push({
        id: `r-${r.id}`,
        type: "recommendation",
        date: r.recommendedAt,
        title: "Recomendación",
        subtitle: r.notes ?? (r.source === "ai_suggested" ? "Sugerida por IA" : "Manual"),
      });
    }

    for (const c of communications) {
      items.push({
        id: `c-${c.id}`,
        type: "communication",
        date: c.sentAt,
        title: `${c.channel === "whatsapp" ? "WhatsApp" : c.channel === "sms" ? "SMS" : "Email"} enviado`,
        subtitle: c.body?.substring(0, 60) ?? "—",
      });
    }

    for (const s of samples) {
      items.push({
        id: `s-${s.id}`,
        type: "sample",
        date: s.deliveredAt,
        title: "Muestra entregada",
        subtitle: s.convertedToPurchase
          ? "Convertida a compra"
          : "Pendiente",
      });
    }

    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return items;
  }, [purchases, recommendations, communications, samples]);

  if (activities.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Sin actividad registrada.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          {/* Timeline */}
          <View style={styles.timeline}>
            <View
              style={[
                styles.dot,
                { backgroundColor: activityColors[item.type] },
              ]}
            />
            {index < activities.length - 1 && (
              <View style={[styles.line, { backgroundColor: theme.border }]} />
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Icon
                name={activityIcons[item.type]}
                size={14}
                color={activityColors[item.type]}
              />
              <Text style={[styles.title, { color: theme.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.date, { color: theme.textTertiary }]}>
                {formatDate(item.date)}
              </Text>
            </View>
            <Text
              style={[styles.subtitle, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {item.subtitle}
            </Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { paddingVertical: Spacing["3xl"], alignItems: "center" },
  emptyText: { ...Typography.body },
  row: { flexDirection: "row", gap: Spacing.md, minHeight: 52 },
  timeline: { alignItems: "center", width: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  line: { width: 1, flex: 1, marginTop: 4 },
  content: { flex: 1, gap: 2, paddingBottom: Spacing.md },
  titleRow: { flexDirection: "row", alignItems: "center", gap: Spacing.xs },
  title: { ...Typography.subhead, fontWeight: "600", flex: 1 },
  date: { ...Typography.caption1 },
  subtitle: { ...Typography.caption1, marginLeft: 20 },
});
