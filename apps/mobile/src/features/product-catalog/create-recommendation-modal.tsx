import React, { useState } from "react";
import { Text, View } from "react-native";

import {
  FormField,
  PickerField,
  SubmitButton,
} from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/hooks/use-theme";
import { useCreateRecommendation } from "./hooks/use-products";

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
  customerId,
  customerName,
  productId,
  productName,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useCreateRecommendation();

  const [visitReason, setVisitReason] = useState("");
  const [notes, setNotes] = useState("");

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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

      {customerName && (
        <FormField
          label="Clienta"
          value={customerName}
          editable={false}
          icon="person"
        />
      )}

      {productName && (
        <FormField
          label="Producto"
          value={productName}
          editable={false}
          icon="bag"
        />
      )}

      {!customerId && (
        <Text style={{ color: theme.warning }}>
          Selecciona una clienta primero desde el Client Book.
        </Text>
      )}

      {!productId && (
        <Text style={{ color: theme.warning }}>
          Selecciona un producto primero desde el Catálogo.
        </Text>
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
