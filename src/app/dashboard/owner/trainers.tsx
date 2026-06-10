import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { Shield, Sparkles, UserCheck } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerTrainersScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/trainers')
      .then((data) => {
        setTrainers(data.trainers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Gym Staff</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your team of personal trainers.</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={{ gap: 14 }}>
            {trainers.map((tr) => (
              <Card key={tr.id} style={styles.trainerCard}>
                <View style={styles.trainerHeader}>
                  <View style={styles.avatarRow}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
                      <Shield size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.trainerName, { color: colors.text }]}>{tr.name}</Text>
                      <Text style={{ fontSize: 12, color: colors.textSecondary }}>Role: {tr.role}</Text>
                    </View>
                  </View>
                  <Badge variant="success">
                    <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>ACTIVE</Text>
                  </Badge>
                </View>

                <View style={styles.specList}>
                  {tr.specialties.map((spec: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      <Text style={{ fontSize: 11, color: colors.textSecondary }}>{spec}</Text>
                    </Badge>
                  ))}
                </View>

                <View style={styles.statFooter}>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>Sessions: {tr.sessionCount}</Text>
                  <Button
                    title="Audit Logs"
                    size="sm"
                    variant="outline"
                    onPress={() => Alert.alert('Roster logs', 'Trainer has clocked 4 sessions today.')}
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
  trainerCard: {
    marginVertical: 0,
  },
  trainerHeader: {
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
  trainerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specList: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  statFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc3',
  },
});
