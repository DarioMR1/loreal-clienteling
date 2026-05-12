import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

// ─── Text Field ──────────────────────────────────────────

interface FormFieldProps extends Omit<TextInputProps, "style"> {
  label: string;
  error?: string;
  icon?: IconName;
}

export function FormField({
  label,
  error,
  icon,
  ...inputProps
}: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputRow,
          {
            borderColor: error ? theme.danger : theme.border,
            backgroundColor: theme.backgroundSecondary,
          },
        ]}
      >
        {icon && <Icon name={icon} size={18} color={theme.textTertiary} />}
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholderTextColor={theme.textTertiary}
          {...inputProps}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      )}
    </View>
  );
}

// ─── Picker / Select ─────────────────────────────────────

interface PickerOption {
  value: string;
  label: string;
}

interface PickerFieldProps {
  label: string;
  options: PickerOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PickerField({
  label,
  options,
  value,
  onChange,
  error,
}: PickerFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected
                    ? theme.accent
                    : theme.backgroundElement,
                  borderColor: selected ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected ? "#FFFFFF" : theme.textSecondary },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      )}
    </View>
  );
}

// ─── Multi-Select Chips ──────────────────────────────────

interface MultiSelectFieldProps {
  label: string;
  options: PickerOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelectField({
  label,
  options,
  value,
  onChange,
}: MultiSelectFieldProps) {
  const theme = useTheme();

  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const selected = value.includes(opt.value);
          return (
            <Pressable
              key={opt.value}
              onPress={() => toggle(opt.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected
                    ? theme.accent
                    : theme.backgroundElement,
                  borderColor: selected ? theme.accent : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: selected ? "#FFFFFF" : theme.textSecondary },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Submit Button ───────────────────────────────────────

interface SubmitButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SubmitButton({
  label,
  onPress,
  loading,
  disabled,
}: SubmitButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.submitButton,
        { backgroundColor: theme.accent },
        (disabled || loading) && styles.submitDisabled,
      ]}
    >
      <Text style={styles.submitText}>{loading ? "Guardando..." : label}</Text>
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  fieldGroup: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.footnote,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    ...Typography.body,
    height: "100%",
  },
  error: {
    ...Typography.caption1,
    marginTop: -2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...Typography.caption1,
    fontWeight: "600",
  },
  submitButton: {
    height: 48,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: "#FFFFFF",
    ...Typography.headline,
  },
});
