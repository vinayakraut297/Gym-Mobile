import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Compass } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerHardwareScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Hardware Integration</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Configure biometric turnstiles and scanners.</Text>
        </View>

        <Card style={styles.hardCard}>
          <Compass size={36} color={colors.primary} />
          <Text style={[styles.hardTitle, { color: colors.text }]}>Bio-Gate Turnstile 1</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: 'center' }}>
            Biometric gate turnstile scanner status: ONLINE. Connection strength: 92% (WiFi).
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  hardCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  hardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
});
