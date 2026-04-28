import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Client } from '@/types';

const skinTypeLabels: Record<string, string> = {
  normal: 'Normal',
  dry: 'Seca',
  oily: 'Grasa',
  combination: 'Mixta',
  sensitive: 'Sensible',
};

const concernLabels: Record<string, string> = {
  wrinkles: 'Arrugas',
  acne: 'Acné',
  'dark-spots': 'Manchas',
  pores: 'Poros',
  dryness: 'Resequedad',
  redness: 'Rojeces',
  dullness: 'Opacidad',
};

const routineLabels: Record<string, string> = {
  day: 'Día',
  night: 'Noche',
  both: 'Día y Noche',
};

const categoryLabels: Record<string, string> = {
  skincare: 'Skincare',
  makeup: 'Makeup',
  fragrance: 'Fragrance',
};

interface BeautyProfileProps {
  client: Client;
}

export function BeautyProfileView({ client }: BeautyProfileProps) {
  const theme = useTheme();
  const { beautyProfile: bp } = client;

  return (
    <View style={styles.container}>
      {/* Skin profile */}
      <View style={styles.section}>
        <SectionHeader title="Perfil de piel" />
        <Card>
          <InfoRow label="Tipo de piel" value={skinTypeLabels[bp.skinType]} theme={theme} />
          <InfoRow label="Tono" value={bp.tone} theme={theme} />
          <InfoRow label="Subtono" value={bp.undertone} theme={theme} />
          <InfoRow label="Rutina" value={routineLabels[bp.routine]} theme={theme} last />
        </Card>
      </View>

      {/* Concerns */}
      <View style={styles.section}>
        <SectionHeader title="Preocupaciones" />
        <View style={styles.tagRow}>
          {bp.concerns.map((c) => (
            <StatusBadge key={c} label={concernLabels[c] ?? c} color={theme.warning} />
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <SectionHeader title="Categorías de interés" />
        <View style={styles.tagRow}>
          {bp.categories.map((c) => (
            <StatusBadge key={c} label={categoryLabels[c] ?? c} color={theme.accent} />
          ))}
        </View>
      </View>

      {/* Shades */}
      {bp.shades.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Shade matches" />
          <Card>
            {bp.shades.map((shade, i) => (
              <InfoRow
                key={shade.category}
                label={shade.category}
                value={`${shade.shade} (${shade.brand})`}
                theme={theme}
                last={i === bp.shades.length - 1}
              />
            ))}
          </Card>
        </View>
      )}

      {/* Ingredients */}
      <View style={styles.section}>
        <SectionHeader title="Ingredientes preferidos" />
        <View style={styles.tagRow}>
          {bp.preferredIngredients.map((ing) => (
            <StatusBadge key={ing} label={ing} color={theme.success} />
          ))}
        </View>
      </View>

      {bp.avoidIngredients.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Ingredientes a evitar" />
          <View style={styles.tagRow}>
            {bp.avoidIngredients.map((ing) => (
              <StatusBadge key={ing} label={ing} color={theme.danger} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function InfoRow({ label, value, theme, last }: { label: string; value: string; theme: ReturnType<typeof useTheme>; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderLight }]}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  infoLabel: {
    ...Typography.subhead,
  },
  infoValue: {
    ...Typography.subhead,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
  },
});
