import React from 'react';
import { TextInput, StyleSheet, View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  label,
  error,
  style,
  inputStyle,
  labelStyle,
  autoCapitalize = 'none',
}: InputProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.background,
            borderColor: error ? colors.destructive : colors.border,
          },
          inputStyle,
        ]}
      />
      {error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
