import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/badge";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Product } from "@/types";
import { useProducts } from "./hooks/use-products";

const categoryLabels: Record<string, string> = {
  all: "Todos",
  skincare: "Skincare",
  makeup: "Makeup",
  fragrance: "Fragancia",
};

const categories = ["all", "skincare", "makeup", "fragrance"];

function formatCurrency(amount: string | number): string {
  return (
    "$" + Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 0 })
  );
}

interface ProductGridProps {
  selectedId: string | null;
  onSelect: (product: Product) => void;
}

export function ProductGrid({ selectedId, onSelect }: ProductGridProps) {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { data: products, isLoading, error, refetch } = useProducts(category);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q))
    );
  }, [products, search]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Catálogo</Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {products?.length ?? 0} productos
        </Text>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Nombre, SKU..."
        />
      </View>

      {/* Category filter pills */}
      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[
              styles.filterPill,
              {
                backgroundColor:
                  cat === category ? theme.accent : theme.backgroundElement,
              },
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                {
                  color: cat === category ? "#FFFFFF" : theme.textSecondary,
                },
              ]}
            >
              {categoryLabels[cat] ?? cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          const imageUrl = item.images?.[0];

          return (
            <Pressable
              onPress={() => onSelect(item)}
              style={[
                styles.row,
                { borderBottomColor: theme.borderLight },
                isSelected && { backgroundColor: theme.backgroundElement },
              ]}
            >
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.productImage}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.productImage,
                    styles.imagePlaceholder,
                    { backgroundColor: theme.backgroundElement },
                  ]}
                />
              )}
              <View style={styles.info}>
                <Text
                  style={[styles.productBrand, { color: theme.textSecondary }]}
                >
                  {item.brand?.displayName ?? "—"}
                </Text>
                <Text
                  style={[styles.productName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text style={[styles.productPrice, { color: theme.accent }]}>
                  {formatCurrency(item.price)}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: { ...Typography.title2 },
  count: { ...Typography.caption1, marginTop: 2 },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  filterPillText: { ...Typography.caption1, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  productImage: { width: 52, height: 52, borderRadius: 8 },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  info: { flex: 1, gap: 2 },
  productBrand: { ...Typography.caption2, textTransform: "uppercase" },
  productName: { ...Typography.body, fontWeight: "600" },
  productPrice: { ...Typography.subhead, fontWeight: "600" },
});
