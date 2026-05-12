import React, { useState } from "react";
import { Text } from "react-native";

import { FormField, SubmitButton } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/hooks/use-theme";
import { useCreateSample } from "./hooks/use-products";

interface Props {
  visible: boolean;
  onClose: () => void;
  customerId?: string;
  customerName?: string;
  productId?: string;
  productName?: string;
  onSuccess: () => void;
}

export function CreateSampleModal({
  visible,
  onClose,
  customerId,
  customerName,
  productId,
  productName,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useCreateSample();

  const isValid = !!customerId && !!productId;

  const handleSubmit = async () => {
    if (!customerId || !productId) return;

    const result = await mutate({ customerId, productId });

    if (result) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Entregar muestra"
      footer={
        <SubmitButton
          label="Registrar muestra"
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
    </Modal>
  );
}
