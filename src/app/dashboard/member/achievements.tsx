import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Award, Trophy, Star } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AchievementsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const achievements = [
    { id: 1, title: 'Consistence King', desc: 'Maintained a 7-day streak of active workout check-ins.', icon: Trophy, unlocked: true },
    { id: 2, title: 'Iron Warrior', desc: 'Bench pressed over 1.25x your bodyweight.', icon: Award, unlocked: true },
    { id: 3, title: 'Water Hero', desc: 'Reach 3.0L water intake for 14 consecutive days.', icon: Star, unlocked: false }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Achievements</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Unlock trophies and verify progress limits.</Text>
        </View>

        <View style={{ gap: 12 }}>
          {achievements.map((ach) => (
            <Card key={ach.id} style={[styles.achCard, !ach.unlocked && { opacity: 0.6 }]}>
              <View style={[styles.iconBox, { backgroundColor: ach.unlocked ? colors.primary + '15' : colors.secondary }]}>
                <ach.icon size={22} color={ach.unlocked ? colors.primary : colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.achTitle, { color: colors.text }]}>{ach.title}</Text>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: ach.unlocked ? colors.primary : colors.textSecondary }}>
                    {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                  </Text>
                </View>
                <Text style={[styles.achDesc, { color: colors.textSecondary }]}>{ach.desc}</Text>
              </View>
            </Card>
          ))}
        </View>
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
  achCard: {
    marginVertical: 0,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    padding: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achDesc: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});
