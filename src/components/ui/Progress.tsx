import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface ProgressProps {
  value: number; // 0 to 100
  style?: ViewStyle;
  barStyle?: ViewStyle;
}

export function Progress({ value, style, barStyle }: ProgressProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <View style={[styles.track, { backgroundColor: colors.muted }, style]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: colors.primary,
            width: `${clampedValue}%`,
          },
          barStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
