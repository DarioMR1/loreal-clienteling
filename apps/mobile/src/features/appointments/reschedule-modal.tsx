import React, { useState } from "react";
import { Text } from "react-native";

import { FormField, SubmitButton } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/hooks/use-theme";
import { useUpdateAppointment } from "./hooks/use-appointments";

interface Props {
  visible: boolean;
  onClose: () => void;
  appointmentId: string;
  onSuccess: () => void;
}

export function RescheduleModal({
  visible,
  onClose,
  appointmentId,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useUpdateAppointment(appointmentId);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const isValid = date.length > 0 && time.length > 0;

  const handleSubmit = async () => {
    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

    const result = await mutate({
      scheduledAt,
      status: "rescheduled",
    });

    if (result) {
      setDate("");
      setTime("");
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Reagendar cita"
      footer={
        <SubmitButton
          label="Reagendar"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isValid}
        />
      }
    >
      {error && <Text style={{ color: theme.danger }}>{error}</Text>}

      <FormField
        label="Nueva fecha *"
        value={date}
        onChangeText={setDate}
        placeholder="AAAA-MM-DD"
        keyboardType="numbers-and-punctuation"
        icon="calendar"
        autoFocus
      />

      <FormField
        label="Nueva hora *"
        value={time}
        onChangeText={setTime}
        placeholder="HH:MM"
        keyboardType="numbers-and-punctuation"
        icon="time"
      />
    </Modal>
  );
}
