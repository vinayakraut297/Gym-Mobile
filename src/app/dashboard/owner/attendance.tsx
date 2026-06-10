import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserCheck, Clock } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerAttendanceScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/attendance')
      .then((data) => {
        setLogs(data.attendance || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Attendance Logs</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Audit branch check-in records.</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={{ gap: 12 }}>
            {logs.map((log) => (
              <Card key={log.id} style={{ marginVertical: 0, padding: 14 }}>
                <View style={styles.logHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <UserCheck size={18} color={colors.primary} />
                    <Text style={[styles.clientTitle, { color: colors.text }]}>User: {log.userId}</Text>
                  </View>
                  <Badge variant="secondary">
                    <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: 'bold' }}>
                      {log.method.toUpperCase()}
                    </Text>
                  </Badge>
                </View>

                <View style={styles.timeRow}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>{new Date(log.checkInTime).toLocaleString()}</Text>
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
});
