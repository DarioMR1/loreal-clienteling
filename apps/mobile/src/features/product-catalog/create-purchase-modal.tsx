import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { FormField, SubmitButton } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Product } from "@/types";
import { useCreatePurchase, useProducts } from "./hooks/use-products";

interface LineItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  customerId?: string;
  customerName?: string;
  onSuccess: () => void;
}

export function CreatePurchaseModal({
  visible,
  onClose,
  customerId,
  customerName,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useCreatePurchase();
  const { data: products } = useProducts();

  const [items, setItems] = useState<LineItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductPicker, setShowProductPicker] = useState(false);

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );

  const isValid = !!customerId && items.length > 0;

  const filteredProducts = useMemo(() => {
    if (!products || !productSearch.trim()) return products?.slice(0, 10) ?? [];
    const q = productSearch.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [products, productSearch]);

  const addProduct = (product: Product) => {
    setItems((prev) => [
      ...prev,
      { product, quantity: 1, unitPrice: Number(product.price) },
    ]);
    setShowProductPicker(false);
    setProductSearch("");
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, qty: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  };

  const handleSubmit = async () => {
    if (!customerId || items.length === 0) return;

    const result = await mutate({
      customerId,
      source: "manual",
      totalAmount,
      items: items.map((i) => ({
        productId: i.product.id,
        sku: i.product.sku,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
    });

    if (result) {
      resetForm();
      onSuccess();
      onClose();
    }
  };

  const resetForm = () => {
    setItems([]);
    setProductSearch("");
    setShowProductPicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCurrency = (n: number) =>
    "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 0 });

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Registrar compra"
      footer={
        <SubmitButton
          label={`Registrar · ${formatCurrency(totalAmount)}`}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isValid}
        />
      }
    >
      {error && <Text style={{ color: theme.danger }}>{error}</Text>}

      {customerName && (
        <FormField
          label="Clienta"
          value={customerName}
          editable={false}
          icon="person"
        />
      )}

      {!customerId && (
        <Text style={{ color: theme.warning }}>
          Selecciona una clienta primero desde el Client Book.
        </Text>
      )}

      {/* Item list */}
      {items.length > 0 && (
        <View style={styles.itemsContainer}>
          {items.map((item, idx) => (
            <View
              key={`${item.product.id}-${idx}`}
              style={[styles.itemRow, { borderColor: theme.border }]}
            >
              <View style={styles.itemInfo}>
                <Text
                  style={[styles.itemName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {item.product.name}
                </Text>
                <Text style={[styles.itemPrice, { color: theme.textSecondary }]}>
                  {formatCurrency(item.unitPrice)} x {item.quantity}
                </Text>
              </View>
              <View style={styles.qtyRow}>
                <Pressable
                  onPress={() =>
                    updateQuantity(idx, Math.max(1, item.quantity - 1))
                  }
                >
                  <Text style={[styles.qtyBtn, { color: theme.textSecondary }]}>
                    -
                  </Text>
                </Pressable>
                <Text style={[styles.qtyValue, { color: theme.text }]}>
                  {item.quantity}
                </Text>
                <Pressable
                  onPress={() => updateQuantity(idx, item.quantity + 1)}
                >
                  <Text style={[styles.qtyBtn, { color: theme.textSecondary }]}>
                    +
                  </Text>
                </Pressable>
              </View>
              <Pressable onPress={() => removeItem(idx)} hitSlop={8}>
                <Icon name="close" size={16} color={theme.danger} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Add product */}
      {showProductPicker ? (
        <View style={styles.pickerContainer}>
          <FormField
            label="Buscar producto"
            value={productSearch}
            onChangeText={setProductSearch}
            placeholder="Nombre o SKU..."
            autoFocus
            icon="search"
          />
          {filteredProducts.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => addProduct(p)}
              style={[styles.productOption, { borderColor: theme.borderLight }]}
            >
              <Text
                style={[styles.productOptionName, { color: theme.text }]}
                numberOfLines={1}
              >
                {p.name}
              </Text>
              <Text style={[styles.productOptionPrice, { color: theme.accent }]}>
                {formatCurrency(Number(p.price))}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Pressable
          onPress={() => setShowProductPicker(true)}
          style={[styles.addButton, { borderColor: theme.border }]}
        >
          <Icon name="add" size={18} color={theme.accent} />
          <Text style={[styles.addButtonText, { color: theme.accent }]}>
            Agregar producto
          </Text>
        </Pressable>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  itemsContainer: { gap: Spacing.sm },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { ...Typography.body, fontWeight: "600" },
  itemPrice: { ...Typography.caption1 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  qtyBtn: { ...Typography.title3, paddingHorizontal: 4 },
  qtyValue: { ...Typography.body, fontWeight: "600", minWidth: 24, textAlign: "center" },
  pickerContainer: { gap: Spacing.sm },
  productOption: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productOptionName: { ...Typography.body, flex: 1 },
  productOptionPrice: { ...Typography.subhead, fontWeight: "600" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: Radius.md,
  },
  addButtonText: { ...Typography.subhead, fontWeight: "600" },
});
