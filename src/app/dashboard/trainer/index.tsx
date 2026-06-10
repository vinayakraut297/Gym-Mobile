import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Dumbbell, Calendar, MessageSquare, Star, Award, TrendingUp, Users } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FloatingAICoach } from '@/components/ui/FloatingAICoach';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainerOverviewScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/dashboard/trainer')
      .then((data) => {
        setClients(data.members || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAction = (msg: string) => {
    Alert.alert('Coach Action', msg);
  };

  if (loading) {
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
          <Text style={[styles.welcomeText, { color: colors.text }]}>Coach {user?.name.split(' ')[0]}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>FitPulse AI Assistant Active</Text>
        </View>

        {/* KPIs */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiCard}>
            <Users size={22} color={colors.primary} />
            <Text style={[styles.kpiVal, { color: colors.text }]}>{clients.length || 2}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>ACTIVE CLIENTS</Text>
          </Card>
          <Card style={styles.kpiCard}>
            <Calendar size={22} color="#22c55e" />
            <Text style={[styles.kpiVal, { color: colors.text }]}>4</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>SESSIONS TODAY</Text>
          </Card>
          <Card style={styles.kpiCard}>
            <Star size={22} color="#f59e0b" />
            <Text style={[styles.kpiVal, { color: colors.text }]}>4.9</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>SATISFACTION</Text>
          </Card>
        </View>

        {/* AI Insight banner */}
        <Card style={[styles.aiCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>🤖 COACH AI INSIGHT</Text>
          <Text style={[styles.aiDesc, { color: colors.text }]}>
            "Client Sam Smith is at risk. He hasn't attended a session in 10 days and has a low Growth Score (45). Consider sending a WhatsApp check-in."
          </Text>
          <Button
            title="Message Sam"
            size="sm"
            onPress={() => router.push('/dashboard/trainer/messages')}
            style={{ marginTop: 12, alignSelf: 'flex-start' }}
          />
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>COACH QUICK ACTIONS</Text>
          <View style={styles.quickGrid}>
            <Button title="Create Plan" variant="outline" size="sm" style={{ flex: 1 }} onPress={() => router.push('/dashboard/trainer/workouts')} />
            <Button title="Log Session" variant="outline" size="sm" style={{ flex: 1 }} onPress={() => handleAction('Session log popup triggered')} />
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TODAY'S SCHEDULE</Text>
          <View style={{ gap: 12 }}>
            <Card style={{ marginVertical: 0, padding: 14 }}>
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionName, { color: colors.text }]}>Alex Gymer</Text>
                <Badge><Text style={{ color: scheme === 'dark' ? '#000' : '#fff', fontSize: 10, fontWeight: 'bold' }}>10:00 AM</Text></Badge>
              </View>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Upper Body Power  •  Completed</Text>
            </Card>

            <Card style={{ marginVertical: 0, padding: 14 }}>
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionName, { color: colors.text }]}>Emily Chen</Text>
                <Badge variant="secondary"><Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: 'bold' }}>06:30 PM</Text></Badge>
              </View>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>Active Card Recovery  •  Pending</Text>
            </Card>
          </View>
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
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    marginVertical: 0,
    padding: 16,
    alignItems: 'center',
  },
  kpiVal: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  aiCard: {
    padding: 16,
    marginBottom: 24,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  aiDesc: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '300',
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
