import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MaterialIconName = 'whatsapp' | 'spa' | 'face-woman' | 'lipstick' | 'lotion' | 'calendar-star' | 'account-star' | 'flask' | 'palette-swatch';

interface IconButtonProps {
  icon: IconName | MaterialIconName;
  label?: string;
  onPress?: () => void;
  variant?: 'default' | 'accent' | 'danger';
  size?: 'sm' | 'md';
}

export function IconButton({ icon, label, onPress, variant = 'default', size = 'md' }: IconButtonProps) {
  const theme = useTheme();

  const bgColor = variant === 'accent' ? theme.accent
    : variant === 'danger' ? theme.danger
    : theme.backgroundElement;

  const iconColor = variant === 'default' ? theme.text : '#FFFFFF';
  const textColor = iconColor;
  const buttonSize = size === 'sm' ? 36 : TouchTarget.min;
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bgColor,
          minHeight: buttonSize,
          opacity: pressed ? 0.7 : 1,
        },
        label ? styles.withLabel : { width: buttonSize },
      ]}
    >
      <Icon name={icon} size={iconSize} color={iconColor} />
      {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  withLabel: {
    paddingHorizontal: Spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
