import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import { FormField, PickerField, SubmitButton } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/hooks/use-theme";
import type { Customer } from "@/types";
import { useUpdateCustomer } from "./hooks/use-clients";

const GENDERS = [
  { value: "female", label: "Femenino" },
  { value: "male", label: "Masculino" },
  { value: "non_binary", label: "No binario" },
  { value: "prefer_not_say", label: "Prefiero no decir" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  customer: Customer;
  onSuccess: () => void;
}

export function EditCustomerModal({
  visible,
  onClose,
  customer,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useUpdateCustomer(customer.id);

  const [firstName, setFirstName] = useState(customer.firstName);
  const [lastName, setLastName] = useState(customer.lastName);
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [email, setEmail] = useState(customer.email ?? "");
  const [gender, setGender] = useState(customer.gender ?? "");

  useEffect(() => {
    if (visible) {
      setFirstName(customer.firstName);
      setLastName(customer.lastName);
      setPhone(customer.phone ?? "");
      setEmail(customer.email ?? "");
      setGender(customer.gender ?? "");
    }
  }, [visible, customer]);

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
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Editar clienta"
      footer={
        <SubmitButton
          label="Guardar cambios"
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
