import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { ShieldAlert, WifiOff, FileSearch, RefreshCw } from 'lucide-react-native';
import { Button } from './Button';
import { Colors } from '@/constants/theme';

export interface ErrorStateProps {
  type?: 'loading' | 'offline' | 'empty' | 'permission';
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  type = 'empty',
  title,
  description,
  onRetry,
  retryText = 'Try Again',
}: ErrorStateProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  // Loading indicator view
  if (type === 'loading') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
          {title || 'Loading content...'}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description || 'Fetching the latest data from FitPulse servers.'}
        </Text>
      </View>
    );
  }

  // Choose icon and descriptions based on error type
  let Icon = FileSearch;
  let resolvedTitle = title || 'No Data Found';
  let resolvedDescription = description || 'We could not find any records in this view.';

  if (type === 'offline') {
    Icon = WifiOff;
    resolvedTitle = title || 'Network Disconnected';
    resolvedDescription = description || 'Check your internet connection and try reloading.';
  } else if (type === 'permission') {
    Icon = ShieldAlert;
    resolvedTitle = title || 'Access Denied';
    resolvedDescription = description || 'You do not have the required permissions to view this content.';
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.backgroundElement }]}>
        <Icon size={44} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{resolvedTitle}</Text>
      
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {resolvedDescription}
      </Text>

      {onRetry ? (
        <Button
          title={retryText}
          onPress={onRetry}
          style={styles.retryButton}
          variant="outline"
        >
          <RefreshCw size={16} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{retryText}</Text>
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    height: 44,
  },
});
