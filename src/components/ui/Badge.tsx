import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({ children, variant = 'default', style, textStyle }: BadgeProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const getStyles = () => {
    let bg: string = colors.primary;
    let textColor: string = scheme === 'dark' ? '#000000' : '#ffffff';
    let border: string = 'transparent';

    if (variant === 'secondary') {
      bg = colors.secondary;
      textColor = colors.text;
    } else if (variant === 'destructive') {
      bg = colors.destructive;
      textColor = '#ffffff';
    } else if (variant === 'outline') {
      bg = 'transparent';
      textColor = colors.text;
      border = colors.border;
    } else if (variant === 'success') {
      bg = '#22c55e';
      textColor = '#ffffff';
    }

    return { bg, textColor, border };
  };

  const { bg, textColor, border } = getStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
