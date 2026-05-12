import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";

import { Avatar } from "@/components/ui/avatar";
import { Icon, type IconName } from "@/components/ui/icon";
import {
  Radius,
  Spacing,
  Sidebar as SidebarDimensions,
  Typography,
} from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/hooks/use-theme";

const sections: { path: string; icon: IconName; label: string }[] = [
  { path: "/(auth)", icon: "home" as IconName, label: "Inicio" },
  { path: "/(auth)/client-book", icon: "people", label: "Client Book" },
  { path: "/(auth)/appointments", icon: "calendar", label: "Citas" },
  { path: "/(auth)/follow-ups", icon: "checkmark-circle", label: "Seguimientos" },
  { path: "/(auth)/products", icon: "bag", label: "Catálogo" },
  { path: "/(auth)/stats", icon: "stats-chart", label: "Métricas" },
  { path: "/(auth)/settings", icon: "settings", label: "Configuración" },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useAuth();
  const width = collapsed
    ? SidebarDimensions.collapsedWidth
    : SidebarDimensions.expandedWidth;
  const userName = session?.user?.fullName ?? session?.user?.name ?? "";
  const userImage = session?.user?.image ?? undefined;

  function isActive(sectionPath: string): boolean {
    if (sectionPath === "/(auth)") {
      // Home is the index — active only when path is exactly /
      return pathname === "/";
    }
    // Strip the (auth) group prefix for matching
    const clean = sectionPath.replace("/(auth)", "");
    return pathname.startsWith(clean);
  }

  return (
    <View
      style={[styles.container, { width, backgroundColor: theme.sidebar }]}
    >
      {/* Brand header */}
      <View style={[styles.header, collapsed && styles.headerCollapsed]}>
        {!collapsed && <Text style={styles.brandName}>L'ORÉAL</Text>}
        {collapsed && <Text style={styles.brandLogo}>L</Text>}
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        {sections.map((section) => {
          const active = isActive(section.path);
          return (
            <Pressable
              key={section.path}
              onPress={() => router.push(section.path as any)}
              style={[
                styles.navItem,
                collapsed && styles.navItemCollapsed,
                active && { backgroundColor: theme.sidebarActive },
              ]}
            >
              <Icon
                name={section.icon}
                size={20}
                color={
                  active ? theme.sidebarAccent : theme.sidebarTextSecondary
                }
              />
              {!collapsed && (
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: active
                        ? theme.sidebarText
                        : theme.sidebarTextSecondary,
                    },
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
        <Avatar uri={userImage} size={collapsed ? 32 : 36} />
        {!collapsed && (
          <View style={styles.advisorInfo}>
            <Text
              style={[styles.advisorName, { color: theme.sidebarText }]}
              numberOfLines={1}
            >
              {userName}
            </Text>
            <Text
              style={[
                styles.advisorStore,
                { color: theme.sidebarTextSecondary },
              ]}
              numberOfLines={1}
            >
              {session?.user?.email ?? ""}
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
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  headerCollapsed: {
    paddingHorizontal: 0,
    alignItems: "center",
  },
  brandName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 4,
  },
  brandLogo: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  nav: {
    flex: 1,
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  navItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  navLabel: {
    ...Typography.subhead,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  footerCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  advisorInfo: {
    flex: 1,
  },
  advisorName: {
    ...Typography.subhead,
    fontWeight: "600",
  },
  advisorStore: {
    ...Typography.caption1,
  },
});
