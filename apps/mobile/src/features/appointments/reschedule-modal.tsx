import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { SubmitButton } from "@/components/ui/form-field";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { Radius, Spacing, Typography } from "@/constants/theme";
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

  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d;
  });
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === "ios");

  const handleSubmit = async () => {
    const result = await mutate({
      scheduledAt: scheduledDate.toISOString(),
      status: "rescheduled",
    });

    if (result) {
      onSuccess();
      onClose();
    }
  };

  const dateDisplay = scheduledDate.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeDisplay = scheduledDate.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
        />
      }
    >
      {error && <Text style={{ color: theme.danger }}>{error}</Text>}

      {/* ── Date picker ── */}
      <View style={styles.pickerSection}>
        <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>
          NUEVA FECHA
        </Text>
        {Platform.OS !== "ios" && (
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[styles.dateButton, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}
          >
            <Icon name="calendar" size={18} color={theme.textTertiary} />
            <Text style={[styles.dateButtonText, { color: theme.text }]}>
              {dateDisplay}
            </Text>
          </Pressable>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            minimumDate={new Date()}
            locale="es-MX"
            onChange={(_, date) => {
              if (Platform.OS !== "ios") setShowDatePicker(false);
              if (date) {
                const updated = new Date(scheduledDate);
                updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                setScheduledDate(updated);
              }
            }}
            style={Platform.OS === "ios" ? styles.iosDatePicker : undefined}
          />
        )}
      </View>

      {/* ── Time picker ── */}
      <View style={styles.pickerSection}>
        <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>
          NUEVA HORA
        </Text>
        {Platform.OS !== "ios" && (
          <Pressable
            onPress={() => setShowTimePicker(true)}
            style={[styles.dateButton, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}
          >
            <Icon name="time" size={18} color={theme.textTertiary} />
            <Text style={[styles.dateButtonText, { color: theme.text }]}>
              {timeDisplay}
            </Text>
          </Pressable>
        )}
        {showTimePicker && (
          <DateTimePicker
            value={scheduledDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minuteInterval={15}
            locale="es-MX"
            onChange={(_, date) => {
              if (Platform.OS !== "ios") setShowTimePicker(false);
              if (date) {
                const updated = new Date(scheduledDate);
                updated.setHours(date.getHours(), date.getMinutes());
                setScheduledDate(updated);
              }
            }}
            style={Platform.OS === "ios" ? styles.iosTimePicker : undefined}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pickerSection: {
    gap: Spacing.sm,
  },
  pickerLabel: {
    ...Typography.footnote,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  dateButtonText: {
    ...Typography.body,
  },
  iosDatePicker: {
    alignSelf: "center",
    maxHeight: 300,
  },
  iosTimePicker: {
    alignSelf: "center",
    height: 120,
  },
});
