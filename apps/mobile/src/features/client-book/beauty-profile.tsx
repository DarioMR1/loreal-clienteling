import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/badge";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { BeautyProfile } from "@/types";

const skinTypeLabels: Record<string, string> = {
  dry: "Seca",
  oily: "Grasa",
  combination: "Mixta",
  sensitive: "Sensible",
  normal: "Normal",
};

const concernLabels: Record<string, string> = {
  acne: "Acné",
  aging: "Anti-edad",
  pigmentation: "Pigmentación",
  dryness: "Resequedad",
  sensitivity: "Sensibilidad",
  pores: "Poros",
  dark_circles: "Ojeras",
  redness: "Rojez",
};

const routineLabels: Record<string, string> = {
  morning: "Mañana",
  night: "Noche",
  both: "Ambas",
};

interface Props {
  beautyProfile: BeautyProfile | null;
}

export function BeautyProfileView({ beautyProfile }: Props) {
  const theme = useTheme();

  if (!beautyProfile) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No se ha capturado perfil de belleza aún.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Skin profile */}
      <SectionHeader title="Perfil de piel" />
      <Card>
        <InfoRow
          label="Tipo de piel"
          value={skinTypeLabels[beautyProfile.skinType ?? ""] ?? "—"}
        />
        <InfoRow label="Tono" value={beautyProfile.skinTone ?? "—"} />
        <InfoRow label="Subtono" value={beautyProfile.skinSubtone ?? "—"} />
        <InfoRow
          label="Rutina"
          value={routineLabels[beautyProfile.routineType ?? ""] ?? "—"}
        />
      </Card>

      {/* Concerns */}
      {beautyProfile.skinConcerns && beautyProfile.skinConcerns.length > 0 && (
        <>
          <SectionHeader title="Preocupaciones" />
          <View style={styles.pillRow}>
            {beautyProfile.skinConcerns.map((c) => (
              <StatusBadge
                key={c}
                label={concernLabels[c] ?? c}
                color={theme.warning}
              />
            ))}
          </View>
        </>
      )}

      {/* Shades */}
      {beautyProfile.shades && beautyProfile.shades.length > 0 && (
        <>
          <SectionHeader title="Tonos registrados" />
          <Card>
            {beautyProfile.shades.map((shade) => (
              <View key={shade.id} style={styles.shadeRow}>
                <View
                  style={[styles.shadeSwatch, { backgroundColor: theme.accent }]}
                />
                <View>
                  <Text style={[styles.shadeCategory, { color: theme.text }]}>
                    {shade.category}
                  </Text>
                  <Text
                    style={[styles.shadeCode, { color: theme.textSecondary }]}
                  >
                    {shade.shadeCode}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </>
      )}

      {/* Preferred ingredients */}
      {beautyProfile.preferredIngredients &&
        beautyProfile.preferredIngredients.length > 0 && (
          <>
            <SectionHeader title="Ingredientes preferidos" />
            <View style={styles.pillRow}>
              {beautyProfile.preferredIngredients.map((i) => (
                <StatusBadge key={i} label={i} color={theme.success} />
              ))}
            </View>
          </>
        )}

      {/* Avoided ingredients */}
      {beautyProfile.avoidedIngredients &&
        beautyProfile.avoidedIngredients.length > 0 && (
          <>
            <SectionHeader title="Ingredientes a evitar" />
            <View style={styles.pillRow}>
              {beautyProfile.avoidedIngredients.map((i) => (
                <StatusBadge key={i} label={i} color={theme.atRisk} />
              ))}
            </View>
          </>
        )}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.lg },
  empty: { paddingVertical: Spacing["3xl"], alignItems: "center" },
  emptyText: { ...Typography.body },
  pillRow: { flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.xs,
  },
  infoLabel: { ...Typography.subhead },
  infoValue: { ...Typography.subhead, fontWeight: "600" },
  shadeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  shadeSwatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  shadeCategory: { ...Typography.subhead, fontWeight: "600" },
  shadeCode: { ...Typography.caption1 },
});
