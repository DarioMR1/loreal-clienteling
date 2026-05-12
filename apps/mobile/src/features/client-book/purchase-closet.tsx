import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Purchase, PurchaseItem } from "@/types";

function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("es-MX", { minimumFractionDigits: 0 });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  purchases: Purchase[];
}

/** Visual "Closet" grid of purchase items — Tulip-style mood board. */
export function PurchaseCloset({ purchases }: Props) {
  const theme = useTheme();

  // Flatten all items across purchases, carrying the purchase date
  const allItems = purchases.flatMap((p) =>
    (p.items ?? []).map((item) => ({
      ...item,
      purchasedAt: p.purchasedAt,
    }))
  );

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  for (const item of allItems) {
    const cat = item.product?.category ?? "otro";
    categoryMap[cat] = (categoryMap[cat] ?? 0) + Number(item.unitPrice) * item.quantity;
  }

  const totalSpent = purchases.reduce(
    (sum, p) => sum + Number(p.totalAmount),
    0
  );

  const avgSpend = purchases.length > 0 ? totalSpent / purchases.length : 0;

  if (purchases.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="bag" size={32} color={theme.textTertiary} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Sin compras registradas.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryTitle, { color: theme.text }]}>
          {purchases.length} transacciones · {formatCurrency(totalSpent)}
        </Text>
        <Text style={[styles.summaryMeta, { color: theme.textSecondary }]}>
          Gasto promedio: {formatCurrency(avgSpend)} / visita
        </Text>
      </View>

      {/* Category breakdown pills */}
      {Object.keys(categoryMap).length > 0 && (
        <View style={styles.catRow}>
          {Object.entries(categoryMap)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, amount]) => {
              const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
              return (
                <View
                  key={cat}
                  style={[
                    styles.catPill,
                    { backgroundColor: theme.backgroundElement },
                  ]}
                >
                  <Text style={[styles.catText, { color: theme.textSecondary }]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} {pct}%
                  </Text>
                </View>
              );
            })}
        </View>
      )}

      {/* Visual grid */}
      <SectionHeader title="Productos comprados" />
      <FlatList
        data={allItems}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => {
          const imageUrl = item.product?.images?.[0];
          return (
            <View style={[styles.gridCard, { borderColor: theme.border }]}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.gridImage}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={[
                    styles.gridImage,
                    styles.gridPlaceholder,
                    { backgroundColor: theme.backgroundElement },
                  ]}
                >
                  <Icon name="bag" size={20} color={theme.textTertiary} />
                </View>
              )}
              <Text
                style={[styles.gridName, { color: theme.text }]}
                numberOfLines={2}
              >
                {item.product?.name ?? item.sku}
              </Text>
              <Text style={[styles.gridPrice, { color: theme.accent }]}>
                {formatCurrency(Number(item.unitPrice))}
              </Text>
              <Text style={[styles.gridDate, { color: theme.textTertiary }]}>
                {formatDate(item.purchasedAt)}
              </Text>
            </View>
          );
        }}
      />
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
  summaryRow: { gap: 2 },
  summaryTitle: { ...Typography.headline },
  summaryMeta: { ...Typography.caption1 },
  catRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  catPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  catText: { ...Typography.caption1, fontWeight: "600" },
  gridRow: { gap: Spacing.sm },
  gridCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    overflow: "hidden",
    maxWidth: "33%",
  },
  gridImage: {
    width: "100%",
    aspectRatio: 1,
  },
  gridPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  gridName: {
    ...Typography.caption1,
    fontWeight: "600",
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  gridPrice: {
    ...Typography.caption1,
    fontWeight: "600",
    paddingHorizontal: Spacing.sm,
  },
  gridDate: {
    ...Typography.caption2,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
