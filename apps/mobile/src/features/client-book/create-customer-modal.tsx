import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

import { FormField, PickerField, SubmitButton } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/hooks/use-theme";
import { useCreateCustomer } from "./hooks/use-clients";

const GENDERS = [
  { value: "female", label: "Femenino" },
  { value: "male", label: "Masculino" },
  { value: "non_binary", label: "No binario" },
  { value: "prefer_not_say", label: "Prefiero no decir" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCustomerModal({ visible, onClose, onSuccess }: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useCreateCustomer();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleSubmit = async () => {
    const result = await mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(email.trim() ? { email: email.trim() } : {}),
      ...(gender ? { gender } : {}),
    });

    if (result) {
      resetForm();
      onSuccess();
      onClose();
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setGender("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Nueva clienta"
      footer={
        <SubmitButton
          label="Registrar clienta"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isValid}
        />
      }
    >
      {error && (
        <Text style={{ color: theme.danger }}>{error}</Text>
      )}

      <FormField
        label="Nombre *"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Nombre"
        autoCapitalize="words"
        autoFocus
      />

      <FormField
        label="Apellido *"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Apellido"
        autoCapitalize="words"
      />

      <FormField
        label="Teléfono"
        value={phone}
        onChangeText={setPhone}
        placeholder="10 dígitos"
        keyboardType="phone-pad"
        icon="call"
      />

      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="cliente@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        icon="mail"
      />

      <PickerField
        label="Género"
        options={GENDERS}
        value={gender}
        onChange={setGender}
      />
    </Modal>
  );
}
