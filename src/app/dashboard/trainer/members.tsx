import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Search, Flame, AlertCircle } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainerMembersScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
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

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.goal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Clients</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track progress metrics of assigned members.</Text>
        </View>

        {/* Search */}
        <Input
          placeholder="Search name or goal..."
          value={search}
          onChangeText={setSearch}
          style={{ marginBottom: 16 }}
        />

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={{ gap: 14 }}>
            {filtered.map((client) => (
              <Card key={client.id} style={styles.clientCard}>
                <View style={styles.clientHeader}>
                  <View style={styles.avatarRow}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.avatarText, { color: colors.primary }]}>
                        {client.name.split(' ').map((n: string) => n[0]).join('')}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.clientName, { color: colors.text }]}>{client.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>Goal: {client.goal}</Text>
                    </View>
                  </View>
                  <Badge variant={client.attendanceRisk === 'High' ? 'destructive' : 'success'}>
                    <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                      {client.attendanceRisk} Risk
                    </Text>
                  </Badge>
                </View>

                {/* Metrics */}
                <View style={[styles.metricsRow, { borderColor: colors.border }]}>
                  <View style={styles.metricItem}>
                    <Flame size={16} color="#f97316" />
                    <Text style={[styles.metricVal, { color: colors.text }]}>{client.streak} days</Text>
                    <Text style={styles.metricLbl}>STREAK</Text>
                  </View>
                  <View style={[styles.metricItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border }]}>
                    <Text style={{ fontSize: 14 }}>Growth</Text>
                    <Text style={[styles.metricVal, { color: colors.text }]}>{client.healthScore}</Text>
                    <Text style={styles.metricLbl}>SCORE</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <AlertCircle size={16} color={client.churnRisk === 'Low' ? '#22c55e' : '#f97316'} />
                    <Text style={[styles.metricVal, { color: colors.text }]}>{client.churnRisk}</Text>
                    <Text style={styles.metricLbl}>CHURN</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <Button
                    title="Workouts"
                    variant="outline"
                    size="sm"
                    style={{ flex: 1 }}
                    onPress={() => router.push('/dashboard/trainer/workouts')}
                  />
                  <Button
                    title="Message"
                    size="sm"
                    style={{ flex: 1 }}
                    onPress={() => router.push('/dashboard/trainer/messages')}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
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
    paddingBottom: 100,
  },
  header: {
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
  clientCard: {
    marginVertical: 0,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  metricLbl: {
    fontSize: 9,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
});
