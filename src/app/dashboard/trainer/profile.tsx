import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Award, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainerProfileScreen() {
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
          <Text style={[styles.title, { color: colors.text }]}>Coach Bio</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your professional credential checklist.</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
            <User size={36} color={colors.primary} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>Mike Coach</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Elite Personal Strength Trainer</Text>

          <View style={styles.specGrid}>
            <View style={[styles.specItem, { backgroundColor: colors.secondary }]}>
              <Award size={16} color={colors.primary} />
              <Text style={[styles.specText, { color: colors.text }]}>ACE Certified</Text>
            </View>
            <View style={[styles.specItem, { backgroundColor: colors.secondary }]}>
              <Shield size={16} color={colors.primary} />
              <Text style={[styles.specText, { color: colors.text }]}>8 Years Exp</Text>
            </View>
          </View>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  specGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  specText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
