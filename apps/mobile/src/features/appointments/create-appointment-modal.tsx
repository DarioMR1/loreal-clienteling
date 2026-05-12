import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Platform,
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
import { eventTypeLabels } from "@/constants/event-colors";
import { useTheme } from "@/hooks/use-theme";
import type { Customer } from "@/types";
import { useClients } from "../client-book/hooks/use-clients";
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
  customerId: initialCustomerId,
  customerName: initialCustomerName,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useCreateAppointment();

  // Client selection
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(initialCustomerId);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | undefined>(initialCustomerName);
  const [clientSearch, setClientSearch] = useState("");
  const clients = useClients();

  // Form fields
  const [eventType, setEventType] = useState("");
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return d;
  });
  const [duration, setDuration] = useState("60");
  const [comments, setComments] = useState("");

  // Picker visibility (Android shows as dialog, iOS inline)
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");
  const [showTimePicker, setShowTimePicker] = useState(Platform.OS === "ios");

  // Sync initial props
  React.useEffect(() => {
    if (visible) {
      setSelectedCustomerId(initialCustomerId);
      setSelectedCustomerName(initialCustomerName);
    }
  }, [visible, initialCustomerId, initialCustomerName]);

  const customerId = selectedCustomerId;
  const customerName = selectedCustomerName;

  const isValid = !!customerId && eventType.length > 0;

  const handleSubmit = async () => {
    if (!customerId) return;

    const result = await mutate({
      customerId,
      eventType,
      scheduledAt: scheduledDate.toISOString(),
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
    const d = new Date();
    d.setHours(d.getHours() + 1, 0, 0, 0);
    setScheduledDate(d);
    setDuration("60");
    setComments("");
    setClientSearch("");
    setSelectedCustomerId(undefined);
    setSelectedCustomerName(undefined);
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
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

  const filteredClients = (clients.data ?? []).filter((c) => {
    if (!clientSearch.trim()) return true;
    const q = clientSearch.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.email?.toLowerCase().includes(q) ?? false)
    );
  });

  // Date/time display helpers
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
            CLIENTA *
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

      {/* ── Event type ── */}
      <PickerField
        label="Tipo de evento *"
        options={EVENT_TYPES}
        value={eventType}
        onChange={setEventType}
      />

      {/* ── Date picker ── */}
      <View style={localStyles.pickerSection}>
        <Text style={[localStyles.pickerLabel, { color: theme.textSecondary }]}>
          FECHA *
        </Text>
        {Platform.OS !== "ios" && (
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[localStyles.dateButton, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}
          >
            <Icon name="calendar" size={18} color={theme.textTertiary} />
            <Text style={[localStyles.dateButtonText, { color: theme.text }]}>
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
            style={Platform.OS === "ios" ? localStyles.iosDatePicker : undefined}
          />
        )}
      </View>

      {/* ── Time picker ── */}
      <View style={localStyles.pickerSection}>
        <Text style={[localStyles.pickerLabel, { color: theme.textSecondary }]}>
          HORA *
        </Text>
        {Platform.OS !== "ios" && (
          <Pressable
            onPress={() => setShowTimePicker(true)}
            style={[localStyles.dateButton, { borderColor: theme.border, backgroundColor: theme.backgroundSecondary }]}
          >
            <Icon name="time" size={18} color={theme.textTertiary} />
            <Text style={[localStyles.dateButtonText, { color: theme.text }]}>
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
            style={Platform.OS === "ios" ? localStyles.iosTimePicker : undefined}
          />
        )}
      </View>

      {/* ── Duration ── */}
      <PickerField
        label="Duración"
        options={DURATIONS}
        value={duration}
        onChange={setDuration}
      />

      {/* ── Notes ── */}
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
