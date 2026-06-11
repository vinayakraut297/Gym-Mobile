import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View, useColorScheme } from 'react-native';
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onHide: () => void;
  duration?: number;
}

export function Toast({ visible, message, type = 'info', onHide, duration = 3000 }: ToastProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      // Fade in and slide down
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  // Set colors based on type
  let typeBg: string = colors.backgroundElement;
  let typeBorder: string = colors.border;
  let typeText: string = colors.text;
  let Icon = Info;

  if (type === 'success') {
    typeBg = scheme === 'dark' ? '#064e3b' : '#ecfdf5';
    typeBorder = scheme === 'dark' ? '#059669' : '#10b981';
    typeText = scheme === 'dark' ? '#a7f3d0' : '#065f46';
    Icon = CheckCircle;
  } else if (type === 'error') {
    typeBg = scheme === 'dark' ? '#7f1d1d' : '#fef2f2';
    typeBorder = scheme === 'dark' ? '#dc2626' : '#ef4444';
    typeText = scheme === 'dark' ? '#fca5a5' : '#991b1b';
    Icon = AlertCircle;
  } else if (type === 'info') {
    typeBg = scheme === 'dark' ? '#1e3a8a' : '#eff6ff';
    typeBorder = scheme === 'dark' ? '#2563eb' : '#3b82f6';
    typeText = scheme === 'dark' ? '#bfdbfe' : '#1e3a8a';
    Icon = Info;
  }

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: typeBg,
          borderColor: typeBorder,
        },
      ]}
    >
      <View style={styles.content}>
        <Icon size={20} color={typeBorder} style={styles.icon} />
        <Text style={[styles.text, { color: typeText }]}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
