import { Image } from "expo-image";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Product } from "@/types";
import { CreateRecommendationModal } from "./create-recommendation-modal";
import { CreateSampleModal } from "./create-sample-modal";

function formatCurrency(amount: string | number): string {
  return (
    "$" + Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 0 })
  );
}

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const theme = useTheme();
  const imageUrl = product.images?.[0];
  const [showRecommend, setShowRecommend] = useState(false);
  const [showSample, setShowSample] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero image */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.heroImage,
            styles.heroPlaceholder,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <Icon name="bag" size={48} color={theme.textTertiary} />
        </View>
      )}

      {/* Product info */}
      <View style={styles.infoSection}>
        <Text style={[styles.brand, { color: theme.textSecondary }]}>
          {product.brand?.displayName ?? "—"}
        </Text>
        <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
        <Text style={[styles.price, { color: theme.accent }]}>
          {formatCurrency(product.price)}
        </Text>
        <View style={styles.skuRow}>
          <Icon name="barcode" size={14} color={theme.textTertiary} />
          <Text style={[styles.sku, { color: theme.textTertiary }]}>
            {product.sku}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <IconButton
          icon="sparkles"
          label="Recomendar"
          variant="accent"
          onPress={() => setShowRecommend(true)}
        />
        <IconButton
          icon="gift"
          label="Entregar muestra"
          variant="default"
          onPress={() => setShowSample(true)}
        />
      </View>

      {/* Description */}
      {product.description && (
        <View style={styles.section}>
          <SectionHeader title="Descripción" />
          <Card>
            <Text style={[styles.description, { color: theme.text }]}>
              {product.description}
            </Text>
          </Card>
        </View>
      )}

      {/* Ingredients */}
      {product.ingredients && product.ingredients.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Ingredientes" />
          <Card>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {product.ingredients.join(", ")}
            </Text>
          </Card>
        </View>
      )}

      {/* Technical details */}
      {(product.technicalSheetUrl ||
        product.tutorialUrl ||
        product.salesArgument) && (
        <View style={styles.section}>
          <SectionHeader title="Recursos" />
          <Card>
            {product.salesArgument && (
              <View style={styles.resourceRow}>
                <Icon name="document-text" size={16} color={theme.accent} />
                <Text style={[styles.resourceText, { color: theme.text }]}>
                  {product.salesArgument}
                </Text>
              </View>
            )}
          </Card>
        </View>
      )}
      <CreateRecommendationModal
        visible={showRecommend}
        onClose={() => setShowRecommend(false)}
        productId={product.id}
        productName={product.name}
        onSuccess={() => setShowRecommend(false)}
      />
      <CreateSampleModal
        visible={showSample}
        onClose={() => setShowSample(false)}
        productId={product.id}
        productName={product.name}
        onSuccess={() => setShowSample(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing["4xl"],
  },
  heroImage: { width: "100%", height: 240, borderRadius: 12 },
  heroPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  infoSection: { gap: 4 },
  brand: {
    ...Typography.caption1,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  name: { ...Typography.title2 },
  price: { ...Typography.title3, marginTop: Spacing.xs },
  skuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  sku: { ...Typography.caption1 },
  actionsRow: { flexDirection: "row", gap: Spacing.sm },
  section: { gap: Spacing.sm },
  description: { ...Typography.body, lineHeight: 24 },
  resourceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  resourceText: { ...Typography.body, flex: 1 },
});
