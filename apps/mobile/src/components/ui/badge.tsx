import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/** Maps backend lifecycle_segment values to display labels and theme color keys. */
const SEGMENT_CONFIG: Record<
  string,
  { label: string; themeKey: "vip" | "returning" | "new" | "atRisk" }
> = {
  vip: { label: "VIP", themeKey: "vip" },
  returning: { label: "Recurrente", themeKey: "returning" },
  new: { label: "Nueva", themeKey: "new" },
  at_risk: { label: "En riesgo", themeKey: "atRisk" },
};

interface BadgeProps {
  segment: string | null | undefined;
}

export function SegmentBadge({ segment }: BadgeProps) {
  const theme = useTheme();
  const config = SEGMENT_CONFIG[segment ?? ""] ?? SEGMENT_CONFIG.new;
  const color = theme[config.themeKey];

  return (
    <View style={[styles.container, { backgroundColor: color + "18" }]}>
      <Text style={[styles.label, { color }]}>{config.label}</Text>
    </View>
  );
}

interface StatusBadgeProps {
  label: string;
  color: string;
}

export function StatusBadge({ label, color }: StatusBadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: color + "18" }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    alignSelf: "flex-start",
  },
  label: {
    ...Typography.caption1,
    fontWeight: "600",
  },
});
