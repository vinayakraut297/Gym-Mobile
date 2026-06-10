import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { IndianRupee, Users, UserCheck, AlertTriangle, ArrowRight, TrendingUp, Bell, Calendar, UserPlus, CreditCard, Smartphone, MessageSquare, Dumbbell, ShieldAlert, Clock } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FloatingAICoach } from '@/components/ui/FloatingAICoach';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerOverviewScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [dateRange, setDateRange] = useState('this-month');

  useEffect(() => {
    fetchWithAuth('/api/dashboard/owner')
      .then(setStats)
      .catch(console.error);
  }, []);

  const handleAction = (msg: string) => {
    Alert.alert('Owner Control', msg);
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>FitPulse Elite</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Command Center Dashboard</Text>
          </View>
          <Pressable onPress={() => router.push('/dashboard/owner/notifications')} style={styles.notifBtn}>
            <Bell size={20} color={colors.text} />
            <View style={styles.notifDot} />
          </Pressable>
        </View>

        {/* Date Selector Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
          {['today', 'this-week', 'this-month', 'this-year'].map((range) => (
            <Pressable
              key={range}
              onPress={() => setDateRange(range)}
              style={[
                styles.dateBtn,
                {
                  backgroundColor: dateRange === range ? colors.primary : colors.backgroundElement,
                  borderColor: dateRange === range ? colors.primary : colors.border
                }
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: dateRange === range ? (scheme === 'dark' ? '#000' : '#fff') : colors.text }}>
                {range.toUpperCase().replace('-', ' ')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiCard}>
            <IndianRupee size={22} color={colors.primary} />
            <Text style={[styles.kpiVal, { color: colors.text }]}>₹8.4L</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>TOTAL REVENUE</Text>
          </Card>
          <Card style={styles.kpiCard}>
            <Users size={22} color="#3b82f6" />
            <Text style={[styles.kpiVal, { color: colors.text }]}>215</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>ACTIVE MEMBERS</Text>
          </Card>
          <Card style={styles.kpiCard}>
            <UserCheck size={22} color="#10b981" />
            <Text style={[styles.kpiVal, { color: colors.text }]}>85</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>TODAY'S ATTENDANCE</Text>
          </Card>
          <Card style={styles.kpiCard}>
            <AlertTriangle size={22} color="#f97316" />
            <Text style={[styles.kpiVal, { color: colors.text }]}>₹16.5k</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>OVERDUE DUES</Text>
          </Card>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>QUICK PANEL</Text>
          <View style={styles.quickGrid}>
            <Pressable onPress={() => router.push('/dashboard/owner/members/add')} style={[styles.quickBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <UserPlus size={18} color={colors.primary} />
              <Text style={[styles.quickText, { color: colors.text }]}>Add Member</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/owner/billing')} style={[styles.quickBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <CreditCard size={18} color="#3b82f6" />
              <Text style={[styles.quickText, { color: colors.text }]}>Collect Bill</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/owner/attendance')} style={[styles.quickBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Smartphone size={18} color="#10b981" />
              <Text style={[styles.quickText, { color: colors.text }]}>Check-In</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/dashboard/owner/notifications')} style={[styles.quickBox, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <MessageSquare size={18} color="#a855f7" />
              <Text style={[styles.quickText, { color: colors.text }]}>Broadcast</Text>
            </Pressable>
          </View>
        </View>

        {/* AI Business Intelligence */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI BUSINESS INTELLIGENCE</Text>
          <Card style={[styles.aiCardAlert, { borderColor: '#ef444430', backgroundColor: '#ef444408' }]}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <ShieldAlert size={18} color="#ef4444" />
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: colors.text }}>High Churn Risk (8 Members)</Text>
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
              These members haven't visited in 14+ days and their renewal invoice is overdue.
            </Text>
            <Button
              title="Send Reactivation SMS"
              variant="destructive"
              size="sm"
              onPress={() => handleAction('Sent automated reactivation notifications.')}
              style={{ marginTop: 12, alignSelf: 'flex-start' }}
            />
          </Card>
        </View>

        {/* Recent Activity Feed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>RECENT ACTIVITY</Text>
          <Card style={{ marginVertical: 0, paddingVertical: 16 }}>
            <View style={styles.activityFeed}>
              {[
                { icon: CreditCard, title: 'Payment Collected', desc: '₹3,500 via UPI from Alex R.', time: '10 mins ago', color: '#10b981' },
                { icon: UserPlus, title: 'New Member Enrollment', desc: 'Emily Chen registered to system.', time: '2 hours ago', color: '#3b82f6' },
                { icon: Dumbbell, title: 'Trainer Assigned', desc: 'Mike assigned 3 new workout plans.', time: '4 hours ago', color: '#cda34f' }
              ].map((act, i) => (
                <View key={i} style={[styles.activityRow, i < 2 && { borderBottomWidth: 0.5, borderBottomColor: '#ccc2' }]}>
                  <View style={[styles.activityIcon, { backgroundColor: act.color + '15' }]}>
                    <act.icon size={16} color={act.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.activityTitle, { color: colors.text }]}>{act.title}</Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>{act.desc}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>{act.time}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  notifBtn: {
    padding: 8,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  dateScroll: {
    gap: 8,
    paddingBottom: 20,
  },
  dateBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
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
    marginVertical: 0,
    padding: 16,
    alignItems: 'center',
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  kpiLabel: {
    fontSize: 9,
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
    gap: 10,
  },
  quickBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  quickText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  aiCardAlert: {
    marginVertical: 0,
    padding: 16,
    borderWidth: 1,
  },
  activityFeed: {
    paddingHorizontal: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
