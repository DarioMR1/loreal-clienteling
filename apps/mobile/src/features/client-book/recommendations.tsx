import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SectionHeader } from '@/components/ui/section-header';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { mockProducts } from '@/data/mock-products';
import { mockRecommendations } from '@/data/mock-clients';
import { useTheme } from '@/hooks/use-theme';
import type { Client, Product } from '@/types';

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-MX')}`;
}

interface RecommendationsProps {
  client: Client;
}

export function Recommendations({ client }: RecommendationsProps) {
  const theme = useTheme();

  const aiProducts = mockProducts.filter(
    (p) =>
      p.category === 'skincare' &&
      p.inStock &&
      !mockRecommendations.some((r) => r.productId === p.id && r.clientId === client.id)
  ).slice(0, 4);

  const pastRecs = mockRecommendations.filter((r) => r.clientId === client.id);

  return (
    <View style={styles.container}>
      {/* AI Recommendations */}
      <View style={styles.section}>
        <SectionHeader title="Recomendaciones IA" />
        <Card padded={false} style={styles.aiCard}>
          <View style={[styles.aiHeader, { backgroundColor: theme.accentLight }]}>
            <View style={[styles.aiIconContainer, { backgroundColor: theme.accent + '20' }]}>
              <Icon name="sparkles" size={18} color={theme.accent} />
            </View>
            <View style={styles.aiHeaderText}>
              <Text style={[styles.aiTitle, { color: theme.accent }]}>Basadas en su perfil</Text>
              <Text style={[styles.aiSubtitle, { color: theme.textSecondary }]}>
                Piel {client.beautyProfile.skinType} · {client.beautyProfile.concerns.join(', ')}
              </Text>
            </View>
          </View>
          <View style={styles.productGrid}>
            {aiProducts.map((product) => (
              <ProductCard key={product.id} product={product} theme={theme} />
            ))}
          </View>
        </Card>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <IconButton icon="barcode" label="Escanear SKU" variant="default" />
        <IconButton icon="sparkles" label="Recomendar" variant="accent" />
        <IconButton icon="bag" label="Registrar compra" variant="default" />
      </View>

      {/* Past recommendations */}
      {pastRecs.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recomendaciones previas" />
          {pastRecs.map((rec) => (
            <Card key={rec.id} style={styles.pastRecCard}>
              <Image source={{ uri: rec.product.imageUrl }} style={styles.pastRecImage} />
              <View style={styles.pastRecInfo}>
                <Text style={[styles.pastRecName, { color: theme.text }]}>{rec.product.name}</Text>
                <Text style={[styles.pastRecBrand, { color: theme.textSecondary }]}>{rec.product.brand} · {formatCurrency(rec.product.price)}</Text>
                <Text style={[styles.pastRecNotes, { color: theme.textTertiary }]}>{rec.notes}</Text>
              </View>
              <View style={styles.pastRecStatus}>
                <Icon
                  name={rec.convertedToPurchase ? 'checkmark-circle' : 'time'}
                  size={16}
                  color={rec.convertedToPurchase ? theme.success : theme.textTertiary}
                />
                <Text style={{ color: rec.convertedToPurchase ? theme.success : theme.textTertiary, fontSize: 12, fontWeight: '600' }}>
                  {rec.convertedToPurchase ? 'Comprado' : 'Pendiente'}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Replenishment logic */}
      <View style={styles.section}>
        <SectionHeader title="Logica de reposicion" />
        <Card style={{ backgroundColor: theme.infoLight }}>
          <View style={styles.replenishRow}>
            <View style={[styles.replenishIconContainer, { backgroundColor: theme.info + '20' }]}>
              <Icon name="refresh" size={18} color={theme.info} />
            </View>
            <View style={styles.replenishInfo}>
              <Text style={[styles.replenishTitle, { color: theme.text }]}>Advanced Genifique Serum</Text>
              <Text style={[styles.replenishSub, { color: theme.info }]}>Comprado el 24 Abr — se agota aprox. en 2 semanas</Text>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}

function ProductCard({ product, theme }: { product: Product; theme: ReturnType<typeof useTheme> }) {
  return (
    <Pressable style={[styles.productCard, { backgroundColor: theme.background, borderColor: theme.borderLight }]}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} contentFit="cover" />
      <View style={styles.productInfo}>
        <Text style={[styles.productBrand, { color: theme.textSecondary }]}>{product.brand}</Text>
        <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>{product.name}</Text>
        <Text style={[styles.productPrice, { color: theme.accent }]}>{formatCurrency(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  aiCard: {
    overflow: 'hidden',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  aiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeaderText: {
    flex: 1,
  },
  aiTitle: {
    ...Typography.subhead,
    fontWeight: '600',
  },
  aiSubtitle: {
    ...Typography.caption1,
    marginTop: 2,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  productCard: {
    width: '48%',
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: Spacing.md,
    gap: 2,
  },
  productBrand: {
    ...Typography.caption2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    ...Typography.subhead,
    fontWeight: '500',
  },
  productPrice: {
    ...Typography.subhead,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pastRecCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  pastRecImage: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
  },
  pastRecInfo: {
    flex: 1,
  },
  pastRecName: {
    ...Typography.subhead,
    fontWeight: '600',
  },
  pastRecBrand: {
    ...Typography.caption1,
  },
  pastRecNotes: {
    ...Typography.caption2,
    marginTop: 2,
  },
  pastRecStatus: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replenishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  replenishIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replenishInfo: {
    flex: 1,
  },
  replenishTitle: {
    ...Typography.subhead,
    fontWeight: '600',
  },
  replenishSub: {
    ...Typography.caption1,
    marginTop: 2,
  },
});
