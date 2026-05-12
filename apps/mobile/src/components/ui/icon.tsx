import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';

import { useTheme } from '@/hooks/use-theme';
import type { ThemeColor } from '@/constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type MaterialName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export type IconName =
  // Sidebar / Navigation
  | 'people' | 'calendar' | 'bag' | 'stats-chart' | 'settings'
  // Client
  | 'person' | 'search' | 'call' | 'mail' | 'gift' | 'refresh' | 'clipboard'
  | 'heart' | 'star' | 'alert-circle' | 'checkmark-circle'
  // Beauty
  | 'color-palette' | 'water' | 'sparkles' | 'eye' | 'eye-off' | 'flower'
  // Products
  | 'barcode' | 'camera' | 'pricetag' | 'cube'
  // Appointments
  | 'time' | 'videocam' | 'ribbon' | 'body'
  // Communication
  | 'chatbubble' | 'send' | 'phone-portrait' | 'mail-open'
  // Actions
  | 'add' | 'close' | 'chevron-forward' | 'create' | 'trash' | 'download'
  // Status
  | 'cloud-done' | 'cloud-offline' | 'sync' | 'shield-checkmark'
  // Performance
  | 'trending-up' | 'trophy' | 'podium'
  // Settings
  | 'globe' | 'notifications' | 'color-fill' | 'information-circle'
  | 'book' | 'help-circle' | 'bug' | 'lock-closed' | 'document-text' | 'log-out';

// Material icons not in Ionicons
type MaterialIconName = 'face-woman' | 'lipstick' | 'lotion' | 'spa' | 'calendar-star'
  | 'account-star' | 'whatsapp' | 'flask' | 'palette-swatch';

const materialIconMap: Record<string, MaterialName> = {
  'face-woman': 'face-woman',
  'lipstick': 'lipstick',
  'lotion': 'lotion',
  'spa': 'spa',
  'calendar-star': 'calendar-star',
  'account-star': 'account-star',
  'whatsapp': 'whatsapp',
  'flask': 'flask',
  'palette-swatch': 'palette-swatch',
};

interface IconProps {
  name: IconName | MaterialIconName;
  size?: number;
  color?: string;
  themeColor?: ThemeColor;
}

export function Icon({ name, size = 22, color, themeColor }: IconProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme[themeColor ?? 'text'];

  // Check if it's a Material icon
  if (name in materialIconMap) {
    return (
      <MaterialCommunityIcons
        name={materialIconMap[name]}
        size={size}
        color={resolvedColor}
      />
    );
  }

  return (
    <Ionicons
      name={name as IoniconName}
      size={size}
      color={resolvedColor}
    />
  );
}
