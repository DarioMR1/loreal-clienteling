import '@/global.css';

import { Platform } from 'react-native';

// Luxury beauty palette — dark sidebar + light content
export const Colors = {
  light: {
    // Core
    text: '#1A1A1A',
    textSecondary: '#8A8A8A',
    textTertiary: '#B0B0B0',
    background: '#FFFFFF',
    backgroundSecondary: '#FAFAFA',
    backgroundElement: '#F5F5F5',
    backgroundSelected: '#EDEDED',

    // Sidebar (dark)
    sidebar: '#0D0D0D',
    sidebarText: '#FFFFFF',
    sidebarTextSecondary: '#999999',
    sidebarActive: '#1A1A1A',
    sidebarAccent: '#C8A96E',

    // Accent — L'Oréal warm gold
    accent: '#C8A96E',
    accentLight: '#F5EDE0',
    accentText: '#FFFFFF',

    // Semantic
    success: '#2E7D32',
    successLight: '#E8F5E9',
    warning: '#F57C00',
    warningLight: '#FFF3E0',
    danger: '#C62828',
    dangerLight: '#FFEBEE',
    info: '#1565C0',
    infoLight: '#E3F2FD',

    // Borders
    border: '#E8E8E8',
    borderLight: '#F0F0F0',

    // Segments (client badges) — per 07-ux-ui-guidelines.md
    vip: '#C9A96E',
    returning: '#6B6B6B',
    new: '#4A7C59',
    atRisk: '#D4A017',

    // Overlays
    overlay: 'rgba(0,0,0,0.4)',
    cardShadow: 'rgba(0,0,0,0.06)',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#666666',
    background: '#0A0A0A',
    backgroundSecondary: '#111111',
    backgroundElement: '#1A1A1A',
    backgroundSelected: '#252525',

    sidebar: '#000000',
    sidebarText: '#FFFFFF',
    sidebarTextSecondary: '#777777',
    sidebarActive: '#1A1A1A',
    sidebarAccent: '#C8A96E',

    accent: '#C8A96E',
    accentLight: '#2A2418',
    accentText: '#FFFFFF',

    success: '#4CAF50',
    successLight: '#1B2E1B',
    warning: '#FF9800',
    warningLight: '#2E2010',
    danger: '#EF5350',
    dangerLight: '#2E1515',
    info: '#42A5F5',
    infoLight: '#152030',

    border: '#252525',
    borderLight: '#1A1A1A',

    vip: '#C9A96E',
    returning: '#9B9B9B',
    new: '#4A7C59',
    atRisk: '#D4A017',

    overlay: 'rgba(0,0,0,0.6)',
    cardShadow: 'rgba(0,0,0,0.3)',
  },
} as const;

export type ThemeColors = typeof Colors.light;
export type ThemeColor = keyof ThemeColors;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// 8px base grid
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

// Border radius
export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Touch targets (retail floor — larger than standard)
export const TouchTarget = {
  min: 44,
  primary: 60,
} as const;

// Sidebar dimensions
export const Sidebar = {
  collapsedWidth: 72,
  expandedWidth: 240,
} as const;

// Typography scale (Apple HIG)
export const Typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' as const },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' as const },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' as const },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' as const },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '400' as const },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
