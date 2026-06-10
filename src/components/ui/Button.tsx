import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface ButtonProps {
  children?: React.ReactNode;
  title?: string;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  children,
  title,
  onPress,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const getStyles = () => {
    let buttonBg: string = colors.primary;
    let buttonBorder: string = 'transparent';
    let textColor: string = scheme === 'dark' ? '#000000' : '#ffffff';

    if (variant === 'outline') {
      buttonBg = 'transparent';
      buttonBorder = colors.border;
      textColor = colors.text;
    } else if (variant === 'secondary') {
      buttonBg = colors.secondary;
      textColor = colors.text;
    } else if (variant === 'destructive') {
      buttonBg = colors.destructive;
      textColor = '#ffffff';
    } else if (variant === 'ghost') {
      buttonBg = 'transparent';
      textColor = colors.text;
    }

    return { buttonBg, buttonBorder, textColor };
  };

  const { buttonBg, buttonBorder, textColor } = getStyles();

  const sizePadding = {
    sm: { paddingVertical: Spacing.one * 1.5, paddingHorizontal: Spacing.three, borderRadius: 8 },
    md: { paddingVertical: Spacing.two * 1.5, paddingHorizontal: Spacing.four, borderRadius: 12 },
    lg: { paddingVertical: Spacing.three * 1.2, paddingHorizontal: Spacing.five, borderRadius: 16 },
  }[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        sizePadding,
        {
          backgroundColor: buttonBg,
          borderColor: buttonBorder,
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : children ? (
        children
      ) : (
        <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 15,
  },
});
