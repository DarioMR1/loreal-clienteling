import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

interface SplitViewProps {
  master: React.ReactNode;
  detail: React.ReactNode;
  masterWidth?: number;
}

export function SplitView({ master, detail, masterWidth = 340 }: SplitViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.master, { width: masterWidth, borderRightColor: theme.border }]}>
        {master}
      </View>
      <View style={[styles.detail, { backgroundColor: theme.backgroundSecondary }]}>
        {detail}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  master: {
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  detail: {
    flex: 1,
  },
});
