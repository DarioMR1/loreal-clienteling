import { useWindowDimensions } from "react-native";

const BREAKPOINTS = {
  tabletPortrait: 768,
  tabletLandscape: 1024,
  largeTablet: 1194,
} as const;

export function useDevice() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isPhone: width < BREAKPOINTS.tabletPortrait,
    isTablet: width >= BREAKPOINTS.tabletPortrait,
    isLandscape: width > height,
    isLargeTablet: width >= BREAKPOINTS.tabletLandscape,
  };
}
