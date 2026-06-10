import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Flame, CheckCircle2, Play, Building2, UserCircle, Search, ArrowRight, MessageSquare } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FloatingAICoach } from '@/components/ui/FloatingAICoach';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MemberHomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [hasGym, setHasGym] = useState(false);
  const [gymCode, setGymCode] = useState('');

  useEffect(() => {
    fetchWithAuth('/api/dashboard/member')
      .then(setStats)
      .catch(console.error);

    if (user?.email === 'alex@example.com') {
      setHasGym(true);
    }
  }, [user]);

  const handleQuickAction = (msg: string) => {
    Alert.alert('FitPulse Action', msg);
  };

  if (!stats) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overdue alert banner */}
        {hasGym && stats.status === 'Overdue' && (
          <View style={[styles.overdueBanner, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive + '30' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.overdueTitle, { color: colors.destructive }]}>₹1,500 Overdue</Text>
              <Text style={[styles.overdueDesc, { color: colors.textSecondary }]}>Your plan expired on May 10th.</Text>
            </View>
            <Button
              title="Pay Now"
              variant="destructive"
              size="sm"
              onPress={() => router.push('/dashboard/member/payments')}
            />
          </View>
        )}

        {/* Welcome Section */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.text }]}>Hello, {user?.name.split(' ')[0]}</Text>
            <Text style={[styles.welcomeSubtext, { color: colors.textSecondary }]}>Keep the momentum going.</Text>
          </View>

          <View style={styles.badgeRow}>
            {hasGym ? (
              <Badge variant="outline">
                <Building2 size={12} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={{ color: colors.text, fontSize: 12 }}>FitPulse Elite</Text>
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Building2 size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Unlinked</Text>
              </Badge>
            )}
          </View>
        </View>

        {/* Trainer Card */}
        {hasGym && (
          <Card style={styles.trainerCard}>
            <View style={styles.trainerHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>RK</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.trainerLabel, { color: colors.primary }]}>YOUR ELITE COACH</Text>
                <Text style={[styles.trainerName, { color: colors.text }]}>Ravi Kumar</Text>
                <Text style={[styles.trainerSub, { color: colors.textSecondary }]}>Next session: Tomorrow, 10 AM</Text>
              </View>
            </View>
            <View style={styles.trainerActions}>
              <Button title="Profile" variant="outline" size="sm" style={{ flex: 1 }} onPress={() => handleQuickAction("Viewing Coach Profile")} />
              <Button title="Message" size="sm" style={{ flex: 1 }} onPress={() => handleQuickAction("Messaging Coach")} />
            </View>
          </Card>
        )}

        {/* Connect Gym Card */}
        {!hasGym && (
          <Card style={[styles.connectCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }]}>
            <Text style={[styles.connectTitle, { color: colors.text }]}>Connect your Gym</Text>
            <Text style={[styles.connectDesc, { color: colors.textSecondary }]}>
              Enter your Gym Invite Code to sync billing, attendance, and workout logs.
            </Text>
            <View style={styles.connectForm}>
              <Input
                placeholder="Gym Code"
                value={gymCode}
                onChangeText={setGymCode}
                style={{ flex: 1, marginVertical: 0 }}
              />
              <Button
                title="Connect"
                onPress={() => {
                  setHasGym(true);
                  handleQuickAction("Connected to Gym successfully!");
                }}
                disabled={!gymCode}
                style={{ height: 48 }}
              />
            </View>
          </Card>
        )}

        {/* KPI Stats */}
        <View style={styles.kpiGrid}>
          <Pressable onPress={() => handleQuickAction("Viewing Streaks")} style={[styles.kpiCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <Flame size={24} color="#f97316" />
            <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.streak}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>DAY STREAK</Text>
          </Pressable>

          <Pressable onPress={() => handleQuickAction("Viewing Health Growth")} style={[styles.kpiCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <Activity size={24} color={colors.primary} />
            <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.healthScore}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>GROWTH SCORE</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/dashboard/member/diet')} style={[styles.kpiCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <Text style={{ fontSize: 22 }}>💧</Text>
            <Text style={[styles.kpiValue, { color: colors.text }]}>70%</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>WATER INT</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/dashboard/member/payments')} style={[styles.kpiCard, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
            <CheckCircle2 size={24} color={hasGym ? colors.primary : colors.textSecondary} />
            <Text style={[styles.kpiValue, { color: colors.text, fontSize: 16, marginTop: 10 }]}>{hasGym ? 'Active' : 'Unlinked'}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>STATUS</Text>
          </Pressable>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>QUICK ACTIONS</Text>
          <View style={styles.quickGrid}>
            <Pressable onPress={() => router.push('/dashboard/member/diet')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>🥗</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Log Meal</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/member/health')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>💧</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Log Water</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/member/progress')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>⚖️</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Add Weight</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/member/workouts')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>🔥</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Workouts</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/member/ai-trainer')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>🤖</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>AI Coach</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/member/bookings')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>📅</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Book Class</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/member/payments')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>💳</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Payments</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/member/program-setup')} style={[styles.quickBtn, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={styles.quickEmoji}>🎯</Text>
              <Text style={[styles.quickBtnText, { color: colors.text }]}>Goals</Text>
            </Pressable>
          </View>
        </View>

        {/* Up Next Workout */}
        <Card style={[styles.workoutCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <View style={styles.workoutHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.workoutLabel, { color: colors.primary }]}>UP NEXT</Text>
              <Text style={[styles.workoutTitle, { color: colors.text }]}>Upper Body Power</Text>
              <Text style={[styles.workoutDesc, { color: colors.textSecondary }]}>AI Suggested based on Muscle Recovery.</Text>
            </View>
            <Pressable onPress={() => router.push('/dashboard/member/workouts')} style={[styles.playButton, { backgroundColor: colors.primary }]}>
              <Play size={20} color={scheme === 'dark' ? '#000000' : '#ffffff'} style={{ marginLeft: 2 }} />
            </Pressable>
          </View>
          <View style={styles.workoutActions}>
            <Button title="Start Workout" onPress={() => router.push('/dashboard/member/workouts')} style={{ flex: 1 }} />
            <Button title="Modify Plan" variant="secondary" onPress={() => router.push('/dashboard/member/workouts')} style={{ flex: 1 }} />
          </View>
        </Card>

        {/* AI Insight Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI GROWTH INSIGHT</Text>
          <Card style={{ borderColor: colors.border, backgroundColor: colors.backgroundElement }}>
            <Text style={[styles.insightText, { color: colors.text }]}>
              "You've attended 4 of your last 5 scheduled sessions. Your strength in Upper Body Power is up 12% over the last 3 weeks. You're entering a prime growth phase. Ensure you hit your protein target of 140g today."
            </Text>
            <Pressable onPress={() => router.push('/dashboard/member/progress')} style={styles.analyticsLink}>
              <Text style={{ color: colors.primary, fontWeight: '700', marginRight: 4 }}>View full analytics</Text>
              <ArrowRight size={14} color={colors.primary} />
            </Pressable>
          </Card>
        </View>
      </ScrollView>

      {/* Floating AI Coach Button Overlay */}
      <FloatingAICoach />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  overdueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  overdueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overdueDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  welcomeSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  trainerCard: {
    marginVertical: 4,
    marginBottom: 20,
  },
  trainerHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trainerLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  trainerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  trainerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  connectCard: {
    marginVertical: 4,
    marginBottom: 20,
  },
  connectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectDesc: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  connectForm: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickBtn: {
    width: '22.5%',
    aspectRatio: 1,
    minWidth: 70,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  quickEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  workoutCard: {
    marginVertical: 20,
    borderWidth: 1.5,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  workoutLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  workoutDesc: {
    fontSize: 13,
    marginTop: 4,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '300',
  },
  analyticsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});
