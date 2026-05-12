import React from "react";
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Icon } from "@/components/ui/icon";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            {/* Title bar */}
            <View
              style={[styles.titleBar, { borderBottomColor: theme.border }]}
            >
              <Text style={[styles.title, { color: theme.text }]}>
                {title}
              </Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Icon name="close" size={20} color={theme.textSecondary} />
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentInner}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>

            {/* Footer */}
            {footer && (
              <View
                style={[styles.footer, { borderTopColor: theme.border }]}
              >
                {footer}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "85%",
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    ...Typography.title3,
    flex: 1,
  },
  content: {
    flexGrow: 0,
  },
  contentInner: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
