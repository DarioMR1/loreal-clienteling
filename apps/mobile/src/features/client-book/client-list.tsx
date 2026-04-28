import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { SegmentBadge } from '@/components/ui/badge';
import { SearchBar } from '@/components/ui/search-bar';
import { Spacing, Typography } from '@/constants/theme';
import { mockClients } from '@/data/mock-clients';
import { useTheme } from '@/hooks/use-theme';
import type { Client } from '@/types';

function daysAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return `Hace ${diff}d`;
}

interface ClientListProps {
  selectedId: string | null;
  onSelect: (client: Client) => void;
}

export function ClientList({ selectedId, onSelect }: ClientListProps) {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return mockClients;
    const q = search.toLowerCase();
    return mockClients.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [search]);

  const renderItem = ({ item }: { item: Client }) => {
    const isSelected = item.id === selectedId;
    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={[
          styles.row,
          { borderBottomColor: theme.borderLight },
          isSelected && { backgroundColor: theme.backgroundElement },
        ]}
      >
        <Avatar uri={item.photoUrl} size={48} borderColor={theme[item.segment === 'at-risk' ? 'atRisk' : item.segment === 'vip' ? 'vip' : 'border']} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {item.firstName} {item.lastName}
            </Text>
            <SegmentBadge segment={item.segment} />
          </View>
          <Text style={[styles.detail, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.preferredBrand} · {daysAgo(item.lastVisit)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Client Book</Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {mockClients.length} clientes
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
    paddingBottom: Spacing['2xl'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.body,
    fontWeight: '600',
    flexShrink: 1,
  },
  detail: {
    ...Typography.caption1,
  },
});
