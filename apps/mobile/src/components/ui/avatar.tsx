import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface AvatarProps {
  uri: string;
  size?: number;
  borderColor?: string;
}

export function Avatar({ uri, size = 44, borderColor }: AvatarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: borderColor ?? theme.border,
        },
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width: size - 2, height: size - 2, borderRadius: (size - 2) / 2 }}
        contentFit="cover"
        transition={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
