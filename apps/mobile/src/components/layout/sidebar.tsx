import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing, Sidebar as SidebarDimensions, Typography } from '@/constants/theme';
import { currentAdvisor } from '@/data/mock-advisor';
import { useTheme } from '@/hooks/use-theme';
import type { SidebarSection } from '@/types';

const sections: { key: SidebarSection; icon: IconName; label: string }[] = [
  { key: 'client-book', icon: 'people', label: 'Client Book' },
  { key: 'appointments', icon: 'calendar', label: 'Appointments' },
  { key: 'product-catalog', icon: 'bag', label: 'Catalog' },
  { key: 'performance', icon: 'stats-chart', label: 'Performance' },
  { key: 'settings', icon: 'settings', label: 'Settings' },
];

interface SidebarProps {
  active: SidebarSection;
  onSelect: (section: SidebarSection) => void;
  collapsed?: boolean;
}

export function Sidebar({ active, onSelect, collapsed = false }: SidebarProps) {
  const theme = useTheme();
  const width = collapsed ? SidebarDimensions.collapsedWidth : SidebarDimensions.expandedWidth;

  return (
    <View style={[styles.container, { width, backgroundColor: theme.sidebar }]}>
      {/* Brand header */}
      <View style={[styles.header, collapsed && styles.headerCollapsed]}>
        {!collapsed && (
          <Text style={styles.brandName}>L'OREAL</Text>
        )}
        {collapsed && <Text style={styles.brandLogo}>L</Text>}
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        {sections.map((section) => {
          const isActive = section.key === active;
          return (
            <Pressable
              key={section.key}
              onPress={() => onSelect(section.key)}
              style={[
                styles.navItem,
                collapsed && styles.navItemCollapsed,
                isActive && { backgroundColor: theme.sidebarActive },
              ]}
            >
              <Icon
                name={section.icon}
                size={20}
                color={isActive ? theme.sidebarAccent : theme.sidebarTextSecondary}
              />
              {!collapsed && (
                <Text
                  style={[
                    styles.navLabel,
                    { color: isActive ? theme.sidebarText : theme.sidebarTextSecondary },
                  ]}
                >
                  {section.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Advisor profile */}
      <View style={[styles.footer, collapsed && styles.footerCollapsed]}>
        <Avatar uri={currentAdvisor.photoUrl} size={collapsed ? 32 : 36} />
        {!collapsed && (
          <View style={styles.advisorInfo}>
            <Text style={[styles.advisorName, { color: theme.sidebarText }]} numberOfLines={1}>
              {currentAdvisor.name}
            </Text>
            <Text style={[styles.advisorStore, { color: theme.sidebarTextSecondary }]} numberOfLines={1}>
              {currentAdvisor.store}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  headerCollapsed: {
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 4,
  },
  brandLogo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  nav: {
    flex: 1,
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 10,
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  navLabel: {
    ...Typography.subhead,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  advisorInfo: {
    flex: 1,
  },
  advisorName: {
    ...Typography.subhead,
    fontWeight: '600',
  },
  advisorStore: {
    ...Typography.caption1,
  },
});
