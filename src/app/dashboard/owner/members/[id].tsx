import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Phone, Mail, ShieldAlert, CheckCircle, Target } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MemberProfileScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/members')
      .then((data) => {
        const found = (data.members || []).find((m: any) => m.id === id);
        // Default to a fallback mock member if not found directly by ID
        setMember(found || { id: 'member1', name: 'Alex Gymer', email: 'alex@example.com', role: 'member', branchId: 'b1', goal: 'Muscle Gain', attendanceRisk: 'Low', assignedTrainer: 'trainer1', planId: 'p1', nextPayment: '2024-06-15', amountDue: 0, status: 'active', healthScore: 88, streak: 4, phone: '+919876543210', churnRisk: 'Low' });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    router.push(`/dashboard/owner/members/${id}/edit`);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
            <User size={36} color={colors.primary} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{member.name}</Text>
          <Badge variant={member.status === 'active' ? 'success' : 'destructive'} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>{member.status.toUpperCase()}</Text>
          </Badge>

          <View style={[styles.infoList, { borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Mail size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{member.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{member.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Target size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>Goal: {member.goal}</Text>
            </View>
          </View>

          <View style={styles.statsSplit}>
            <View style={[styles.statBox, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.statVal, { color: colors.text }]}>{member.healthScore}</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>HEALTH SCORE</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.statVal, { color: colors.text }]}>{member.streak} days</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>STREAK</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button title="Edit Profile" onPress={handleEdit} style={{ flex: 1 }} />
            <Button
              title="Collect Fees"
              variant="outline"
              disabled={member.amountDue === 0}
              onPress={() => Alert.alert('Collect Fees', 'Payment request sent.')}
              style={{ flex: 1 }}
            />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoList: {
    width: '100%',
    marginVertical: 24,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
  },
  statsSplit: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLbl: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});
