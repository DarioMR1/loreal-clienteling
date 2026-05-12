import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/hooks/use-theme';

const ROLE_LABELS: Record<string, string> = {
  ba: 'Beauty Advisor',
  manager: 'Store Manager',
  supervisor: 'Zone Supervisor',
  admin: 'Administrador',
};

export function SettingsScreen() {
  const theme = useTheme();
  const { session, signOut } = useAuth();

  const user = session?.user;
  const userName = user?.fullName ?? user?.name ?? '';
  const userEmail = user?.email ?? '';
  const userRole = ROLE_LABELS[user?.role ?? 'ba'] ?? user?.role ?? '';
  const userImage = user?.image ?? undefined;

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile */}
      <Card>
        <View style={styles.profileRow}>
          <Avatar uri={userImage} size={64} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{userName}</Text>
            <Text style={[styles.profileMeta, { color: theme.textSecondary }]}>{userEmail}</Text>
            <Text style={[styles.profileMeta, { color: theme.textSecondary }]}>{userRole}</Text>
          </View>
        </View>
      </Card>

      {/* Sync status */}
      <View style={styles.section}>
        <SectionHeader title="Estado de sincronización" />
        <Card>
          <View style={styles.syncRow}>
            <Icon name="cloud-done" size={24} color={theme.success} />
            <View style={styles.syncInfo}>
              <Text style={[styles.syncTitle, { color: theme.text }]}>Todo sincronizado</Text>
              <Text style={[styles.syncSub, { color: theme.textSecondary }]}>Última sincronización: hace 2 min</Text>
            </View>
            <StatusBadge label="Online" color={theme.success} />
          </View>
        </Card>
      </View>

      {/* Settings list */}
      <View style={styles.section}>
        <SectionHeader title="Configuración" />
        <Card padded={false}>
          <SettingsRow icon="globe" label="Idioma" value="Español" theme={theme} />
          <SettingsRow icon="notifications" label="Notificaciones" value="Activadas" theme={theme} />
          <SettingsRow icon="color-fill" label="Apariencia" value="Automático" theme={theme} />
          <SettingsRow icon="information-circle" label="Versión de la app" value="1.0.0" theme={theme} last />
        </Card>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <SectionHeader title="Soporte" />
        <Card padded={false}>
          <SettingsRow icon="book" label="Materiales de entrenamiento" value="" theme={theme} />
          <SettingsRow icon="help-circle" label="Centro de ayuda" value="" theme={theme} />
          <SettingsRow icon="bug" label="Reportar un problema" value="" theme={theme} last />
        </Card>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <SectionHeader title="Legal" />
        <Card padded={false}>
          <SettingsRow icon="lock-closed" label="Aviso de privacidad" value="v2.1" theme={theme} />
          <SettingsRow icon="document-text" label="Términos y condiciones" value="" theme={theme} last />
        </Card>
      </View>

      {/* Logout */}
      <Pressable onPress={handleSignOut}>
        <Card style={{ backgroundColor: theme.dangerLight }}>
          <View style={styles.logoutRow}>
            <Icon name="log-out" size={20} color={theme.danger} />
            <Text style={[styles.logoutText, { color: theme.danger }]}>Cerrar sesión</Text>
          </View>
        </Card>
      </Pressable>
    </ScrollView>
  );
}

function SettingsRow({ icon, label, value, theme, last }: { icon: IconName; label: string; value: string; theme: ReturnType<typeof useTheme>; last?: boolean }) {
  return (
    <View style={[styles.settingsRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderLight }]}>
      <Icon name={icon} size={20} themeColor="textSecondary" />
      <Text style={[styles.settingsLabel, { color: theme.text }]}>{label}</Text>
      {value ? <Text style={[styles.settingsValue, { color: theme.textSecondary }]}>{value}</Text> : null}
      <Icon name="chevron-forward" size={16} themeColor="textTertiary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    ...Typography.title2,
  },
  profileMeta: {
    ...Typography.subhead,
  },
  section: {
    gap: Spacing.sm,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  syncInfo: {
    flex: 1,
  },
  syncTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  syncSub: {
    ...Typography.caption1,
    marginTop: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  settingsLabel: {
    ...Typography.body,
    flex: 1,
  },
  settingsValue: {
    ...Typography.subhead,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  logoutText: {
    ...Typography.body,
    fontWeight: '600',
  },
});
