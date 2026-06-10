import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable style={styles.overlay} onPress={() => onOpenChange(false)}>
        <Pressable style={styles.cardContainer} onPress={() => {}}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function DialogContent({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.content, { backgroundColor: colors.backgroundElement, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

export function DialogHeader({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function DialogTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return <Text style={[styles.title, { color: colors.text }, style]}>{children}</Text>;
}

export function DialogDescription({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  return <Text style={[styles.description, { color: colors.textSecondary }, style]}>{children}</Text>;
}

export function DialogFooter({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 450,
  },
  content: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
  },
});
