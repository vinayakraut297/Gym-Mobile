import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Flame, Eye, Compass } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivitiesScreen() {
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
          <Text style={[styles.title, { color: colors.text }]}>Gym Activities</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track step metrics and active duration logs.</Text>
        </View>

        <Card style={styles.actCard}>
          <Flame size={36} color={colors.primary} />
          <Text style={[styles.actVal, { color: colors.text }]}>8,400 steps</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
            Completed 84% of today's target (10,000 steps). Keep walking!
          </Text>
          <Button
            title="Log Walk"
            onPress={() => Alert.alert('Logged', 'Added 1,500 steps to database.')}
            style={{ marginTop: 20, width: '100%' }}
          />
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
  actCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  actVal: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
  },
});
