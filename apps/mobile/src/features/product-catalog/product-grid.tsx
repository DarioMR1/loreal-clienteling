import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { SearchBar } from '@/components/ui/search-bar';
import { StatusBadge } from '@/components/ui/badge';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { mockProducts } from '@/data/mock-products';
import { useTheme } from '@/hooks/use-theme';
import type { Product, ProductCategory } from '@/types';

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-MX')}`;
}

const categoryFilters: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'skincare', label: 'Skincare' },
  { key: 'makeup', label: 'Makeup' },
  { key: 'fragrance', label: 'Fragrance' },
  { key: 'haircare', label: 'Haircare' },
];

interface ProductGridProps {
  selectedId: string | null;
  onSelect: (product: Product) => void;
}

export function ProductGrid({ selectedId, onSelect }: ProductGridProps) {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');

  const filtered = useMemo(() => {
    let result = mockProducts;
    if (category !== 'all') result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return result;
  }, [search, category]);

  const renderItem = ({ item }: { item: Product }) => {
    const isSelected = item.id === selectedId;
    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={[
          styles.row,
          { borderBottomColor: theme.borderLight },
          isSelected && { backgroundColor: theme.backgroundElement },
        ]}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} contentFit="cover" />
        <View style={styles.info}>
          <Text style={[styles.brand, { color: theme.textSecondary }]}>{item.brand}</Text>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.accent }]}>{formatCurrency(item.price)}</Text>
            {!item.inStock && <StatusBadge label="Agotado" color={theme.danger} />}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Catalog</Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>{mockProducts.length} productos</Text>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Nombre, marca o SKU..." />
      </View>

      {/* Category pills */}
      <View style={styles.categoryRow}>
        {categoryFilters.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => setCategory(cat.key)}
            style={[
              styles.categoryPill,
              {
                backgroundColor: category === cat.key ? theme.accent : theme.backgroundElement,
              },
            ]}
          >
            <Text style={{ color: category === cat.key ? '#FFF' : theme.textSecondary, fontSize: 13, fontWeight: '600' }}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.title2,
  },
  count: {
    ...Typography.caption1,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  brand: {
    ...Typography.caption2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    ...Typography.body,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  price: {
    ...Typography.subhead,
    fontWeight: '700',
  },
});
