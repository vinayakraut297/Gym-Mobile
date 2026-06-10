/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#17171a',
    background: '#fbfaf9',
    backgroundElement: '#ffffff',
    backgroundSelected: '#f2f0ec',
    textSecondary: '#73737c',
    primary: '#cda34f',
    secondary: '#f2f0ec',
    muted: '#e8e6e1',
    accent: '#b38d38',
    destructive: '#c22f42',
    border: '#e3dfd7',
    input: '#e3dfd7',
    ring: '#cda34f',
  },
  dark: {
    text: '#fcfcfc',
    background: '#0b0b0e',
    backgroundElement: '#15151a',
    backgroundSelected: '#22222a',
    textSecondary: '#8a8a99',
    primary: '#d4af37',
    secondary: '#22222a',
    muted: '#1c1c22',
    accent: '#e5c158',
    destructive: '#db3b52',
    border: '#292933',
    input: '#292933',
    ring: '#d4af37',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
