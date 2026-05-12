import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  FormField,
  PickerField,
  SubmitButton,
} from "@/components/ui/form-field";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { SearchBar } from "@/components/ui/search-bar";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Customer, Product } from "@/types";
import { useClients } from "../client-book/hooks/use-clients";
import { useCreateRecommendation, useProducts } from "./hooks/use-products";

const VISIT_REASONS = [
  { value: "new_purchase", label: "Compra nueva" },
  { value: "rebuy", label: "Recompra" },
  { value: "gift", label: "Regalo" },
  { value: "concern", label: "Consulta" },
  { value: "promotion", label: "Promoción" },
  { value: "browsing", label: "Exploración" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  customerId?: string;
  customerName?: string;
  productId?: string;
  productName?: string;
  onSuccess: () => void;
}

export function CreateRecommendationModal({
  visible,
  onClose,
  customerId: initialCustomerId,
  customerName: initialCustomerName,
  productId: initialProductId,
  productName: initialProductName,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useCreateRecommendation();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(initialCustomerId);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | undefined>(initialCustomerName);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(initialProductId);
  const [selectedProductName, setSelectedProductName] = useState<string | undefined>(initialProductName);

  const [visitReason, setVisitReason] = useState("");
  const [notes, setNotes] = useState("");

  // Search state
  const [clientSearch, setClientSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Data for pickers
  const clients = useClients();
  const products = useProducts(undefined, productSearch || undefined);

  // Sync initial props when modal opens with new values
  React.useEffect(() => {
    if (visible) {
      setSelectedCustomerId(initialCustomerId);
      setSelectedCustomerName(initialCustomerName);
      setSelectedProductId(initialProductId);
      setSelectedProductName(initialProductName);
    }
  }, [visible, initialCustomerId, initialCustomerName, initialProductId, initialProductName]);

  const customerId = selectedCustomerId;
  const customerName = selectedCustomerName;
  const productId = selectedProductId;
  const productName = selectedProductName;

  const isValid = !!customerId && !!productId;

  const handleSubmit = async () => {
    if (!customerId || !productId) return;

    const result = await mutate({
      customerId,
      productId,
      source: "manual",
      ...(visitReason ? { visitReason } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    });

    if (result) {
      resetForm();
      onSuccess();
      onClose();
    }
  };

  const resetForm = () => {
    setVisitReason("");
    setNotes("");
    setClientSearch("");
    setProductSearch("");
    setSelectedCustomerId(undefined);
    setSelectedCustomerName(undefined);
    setSelectedProductId(undefined);
    setSelectedProductName(undefined);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectCustomer = useCallback((c: Customer) => {
    setSelectedCustomerId(c.id);
    setSelectedCustomerName(`${c.firstName} ${c.lastName}`);
    setClientSearch("");
  }, []);

  const selectProduct = useCallback((p: Product) => {
    setSelectedProductId(p.id);
    setSelectedProductName(p.name);
    setProductSearch("");
  }, []);

  const filteredClients = (clients.data ?? []).filter((c) => {
    if (!clientSearch.trim()) return true;
    const q = clientSearch.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.email?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Crear recomendación"
      footer={
        <SubmitButton
          label="Recomendar"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isValid}
        />
      }
    >
      {error && <Text style={{ color: theme.danger }}>{error}</Text>}

      {/* ── Client selector ── */}
      {customerId ? (
        <View style={localStyles.selectedRow}>
          <FormField
            label="Clienta"
            value={customerName ?? ""}
            editable={false}
            icon="person"
          />
          {!initialCustomerId && (
            <Pressable
              onPress={() => {
                setSelectedCustomerId(undefined);
                setSelectedCustomerName(undefined);
              }}
              hitSlop={8}
              style={localStyles.changeBtn}
            >
              <Text style={[localStyles.changeBtnText, { color: theme.accent }]}>
                Cambiar
              </Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={localStyles.pickerSection}>
          <Text style={[localStyles.pickerLabel, { color: theme.textSecondary }]}>
            CLIENTA
          </Text>
          <SearchBar
            value={clientSearch}
            onChangeText={setClientSearch}
            placeholder="Buscar clienta..."
          />
          {clients.isLoading ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <View style={[localStyles.listContainer, { borderColor: theme.border }]}>
              {filteredClients.length === 0 ? (
                <Text style={[localStyles.emptyText, { color: theme.textTertiary }]}>
                  No se encontraron clientas
                </Text>
              ) : (
                filteredClients.slice(0, 5).map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => selectCustomer(c)}
                    style={({ pressed }) => [
                      localStyles.listItem,
                      { borderBottomColor: theme.border },
                      pressed && { backgroundColor: theme.backgroundElement },
                    ]}
                  >
                    <Icon name="person" size={16} color={theme.textTertiary} />
                    <Text style={[localStyles.listItemText, { color: theme.text }]}>
                      {c.firstName} {c.lastName}
                    </Text>
                    {c.email && (
                      <Text style={[localStyles.listItemSub, { color: theme.textTertiary }]}>
                        {c.email}
                      </Text>
                    )}
                  </Pressable>
                ))
              )}
            </View>
          )}
        </View>
      )}

      {/* ── Product selector ── */}
      {productId ? (
        <View style={localStyles.selectedRow}>
          <FormField
            label="Producto"
            value={productName ?? ""}
            editable={false}
            icon="bag"
          />
          {!initialProductId && (
            <Pressable
              onPress={() => {
                setSelectedProductId(undefined);
                setSelectedProductName(undefined);
              }}
              hitSlop={8}
              style={localStyles.changeBtn}
            >
              <Text style={[localStyles.changeBtnText, { color: theme.accent }]}>
                Cambiar
              </Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={localStyles.pickerSection}>
          <Text style={[localStyles.pickerLabel, { color: theme.textSecondary }]}>
            PRODUCTO
          </Text>
          <SearchBar
            value={productSearch}
            onChangeText={setProductSearch}
            placeholder="Buscar producto..."
          />
          {products.isLoading ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <View style={[localStyles.listContainer, { borderColor: theme.border }]}>
              {(products.data ?? []).length === 0 ? (
                <Text style={[localStyles.emptyText, { color: theme.textTertiary }]}>
                  No se encontraron productos
                </Text>
              ) : (
                (products.data ?? []).slice(0, 5).map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => selectProduct(p)}
                    style={({ pressed }) => [
                      localStyles.listItem,
                      { borderBottomColor: theme.border },
                      pressed && { backgroundColor: theme.backgroundElement },
                    ]}
                  >
                    <Icon name="bag" size={16} color={theme.textTertiary} />
                    <Text style={[localStyles.listItemText, { color: theme.text }]} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={[localStyles.listItemSub, { color: theme.textTertiary }]}>
                      {p.brand?.displayName ?? ""}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          )}
        </View>
      )}

      <PickerField
        label="Motivo de la visita"
        options={VISIT_REASONS}
        value={visitReason}
        onChange={setVisitReason}
      />

      <FormField
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        placeholder="Notas sobre la recomendación..."
        multiline
        numberOfLines={3}
      />
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  selectedRow: {
    position: "relative",
  },
  changeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  changeBtnText: {
    ...Typography.caption1,
    fontWeight: "600",
  },
  pickerSection: {
    gap: Spacing.sm,
  },
  pickerLabel: {
    ...Typography.footnote,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listContainer: {
    maxHeight: 200,
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItemText: {
    ...Typography.body,
    flex: 1,
  },
  listItemSub: {
    ...Typography.caption1,
  },
  emptyText: {
    ...Typography.caption1,
    textAlign: "center",
    paddingVertical: Spacing.lg,
  },
});
