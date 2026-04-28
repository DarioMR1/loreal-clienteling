import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Product } from '@/types';

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-MX')}`;
}

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const theme = useTheme();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero image */}
      <Image source={{ uri: product.imageUrl }} style={styles.heroImage} contentFit="cover" />

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.brand, { color: theme.textSecondary }]}>{product.brand}</Text>
        <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.accent }]}>{formatCurrency(product.price)}</Text>
          <StatusBadge
            label={product.inStock ? 'En stock' : 'Agotado'}
            color={product.inStock ? theme.success : theme.danger}
          />
        </View>
        <View style={styles.skuRow}>
          <Icon name="barcode" size={14} themeColor="textTertiary" />
          <Text style={[styles.sku, { color: theme.textTertiary }]}>{product.sku}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <IconButton icon="sparkles" label="Recomendar a cliente" variant="accent" />
        <IconButton icon="camera" label="Escanear" variant="default" />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <SectionHeader title="Descripcion" />
        <Card>
          <Text style={[styles.description, { color: theme.text }]}>{product.description}</Text>
        </Card>
      </View>

      {/* Attributes */}
      {Object.keys(product.attributes).length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Atributos" />
          <Card>
            {Object.entries(product.attributes).map(([key, value], i, arr) => (
              <View
                key={key}
                style={[
                  styles.attrRow,
                  i < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderLight },
                ]}
              >
                <Text style={[styles.attrKey, { color: theme.textSecondary }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Text style={[styles.attrValue, { color: theme.text }]}>{value}</Text>
              </View>
            ))}
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  heroImage: {
    width: '100%',
    height: 280,
    borderRadius: Radius.lg,
  },
  info: {
    gap: Spacing.xs,
  },
  brand: {
    ...Typography.caption1,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    ...Typography.title1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  price: {
    ...Typography.title2,
    fontWeight: '700',
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  sku: {
    ...Typography.caption1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  section: {
    gap: Spacing.sm,
  },
  description: {
    ...Typography.body,
    lineHeight: 26,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  attrKey: {
    ...Typography.subhead,
  },
  attrValue: {
    ...Typography.subhead,
    fontWeight: '500',
  },
});
