import React, { useState } from "react";
import { Text } from "react-native";

import {
  FormField,
  PickerField,
  SubmitButton,
} from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { eventTypeLabels } from "@/constants/event-colors";
import { useTheme } from "@/hooks/use-theme";
import { useCreateAppointment } from "./hooks/use-appointments";

const EVENT_TYPES = Object.entries(eventTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

const DURATIONS = [
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
  { value: "120", label: "120 min" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  customerId?: string;
  customerName?: string;
  onSuccess: () => void;
}

export function CreateAppointmentModal({
  visible,
  onClose,
  customerId,
  customerName,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useCreateAppointment();

  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [comments, setComments] = useState("");

  const isValid =
    !!customerId && eventType.length > 0 && date.length > 0 && time.length > 0;

  const handleSubmit = async () => {
    if (!customerId) return;

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

    const result = await mutate({
      customerId,
      eventType,
      scheduledAt,
      durationMinutes: Number(duration),
      ...(comments.trim() ? { comments: comments.trim() } : {}),
    });

    if (result) {
      resetForm();
      onSuccess();
      onClose();
    }
  };

  const resetForm = () => {
    setEventType("");
    setDate("");
    setTime("");
    setDuration("60");
    setComments("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Agendar cita"
      footer={
        <SubmitButton
          label="Agendar"
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

      <PickerField
        label="Tipo de evento *"
        options={EVENT_TYPES}
        value={eventType}
        onChange={setEventType}
      />

      <FormField
        label="Fecha *"
        value={date}
        onChangeText={setDate}
        placeholder="AAAA-MM-DD"
        keyboardType="numbers-and-punctuation"
        icon="calendar"
      />

      <FormField
        label="Hora *"
        value={time}
        onChangeText={setTime}
        placeholder="HH:MM"
        keyboardType="numbers-and-punctuation"
        icon="time"
      />

      <PickerField
        label="Duración"
        options={DURATIONS}
        value={duration}
        onChange={setDuration}
      />

      <FormField
        label="Notas"
        value={comments}
        onChangeText={setComments}
        placeholder="Comentarios adicionales..."
        multiline
        numberOfLines={3}
      />
    </Modal>
  );
}
