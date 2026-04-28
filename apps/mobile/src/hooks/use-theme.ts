import { Colors, type ThemeColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme(): ThemeColors {
  const scheme = useColorScheme();
  const key = scheme === 'unspecified' ? 'light' : scheme;
  return Colors[key] as ThemeColors;
}
