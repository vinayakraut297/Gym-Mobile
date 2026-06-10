import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Gift, Copy } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReferralsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const handleCopy = () => {
    Alert.alert('Code Copied', 'Referral code FITPULSE-FRIEND copied to clipboard.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Refer a Friend</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Invite your friends and earn rewards.</Text>
        </View>

        <Card style={styles.refCard}>
          <Gift size={40} color={colors.primary} />
          <Text style={[styles.refTitle, { color: colors.text }]}>Share the Energy</Text>
          <Text style={[styles.refDesc, { color: colors.textSecondary }]}>
            Give your friend ₹500 off their first month, and get 50 free AI Tokens credited when they join.
          </Text>

          <Pressable onPress={handleCopy} style={[styles.codeBox, { borderColor: colors.primary, backgroundColor: colors.primary + '08' }]}>
            <Text style={[styles.codeText, { color: colors.primary }]}>FITPULSE-FRIEND</Text>
            <Copy size={16} color={colors.primary} />
          </Pressable>

          <Button title="Share Invite Code" onPress={() => Alert.alert('Share Option', 'Link sharing triggered.')} style={{ width: '100%' }} />
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
  refCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  refTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  refDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 24,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
