import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { SegmentBadge } from "@/components/ui/badge";
import { SearchBar } from "@/components/ui/search-bar";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Customer } from "@/types";
import { useClients } from "./hooks/use-clients";

function daysAgo(dateStr: string | null): string {
  if (!dateStr) return "Sin visita";
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000
  );
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return `Hace ${diff}d`;
}

interface ClientListProps {
  selectedId: string | null;
  onSelect: (customer: Customer) => void;
}

export function ClientList({ selectedId, onSelect }: ClientListProps) {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const { data: clients, isLoading, error, refetch } = useClients();

  const filtered = useMemo(() => {
    if (!clients) return [];
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [clients, search]);

  const renderItem = useCallback(
    ({ item }: { item: Customer }) => {
      const isSelected = item.id === selectedId;
      const segmentKey = item.lifecycleSegment ?? "new";
      const borderColor =
        segmentKey === "at_risk"
          ? theme.atRisk
          : segmentKey === "vip"
            ? theme.vip
            : theme.border;

      return (
        <Pressable
          onPress={() => onSelect(item)}
          style={[
            styles.row,
            { borderBottomColor: theme.borderLight },
            isSelected && { backgroundColor: theme.backgroundElement },
          ]}
        >
          <Avatar uri={undefined} size={48} borderColor={borderColor} />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text
                style={[styles.name, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.firstName} {item.lastName}
              </Text>
              <SegmentBadge segment={item.lifecycleSegment} />
            </View>
            <Text
              style={[styles.detail, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {daysAgo(item.lastContactAt)}
            </Text>
          </View>
        </Pressable>
      );
    },
    [selectedId, onSelect, theme]
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          {error}
        </Text>
        <Pressable onPress={refetch} style={styles.retryButton}>
          <Text style={{ color: theme.accent }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Client Book</Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {clients?.length ?? 0} clientes
        </Text>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Nombre, teléfono o email..."
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  title: {
    ...Typography.title2,
  },
  count: {
    ...Typography.caption1,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  list: {
    paddingBottom: Spacing["2xl"],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  name: {
    ...Typography.body,
    fontWeight: "600",
    flexShrink: 1,
  },
  detail: {
    ...Typography.caption1,
  },
  errorText: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  retryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
});
