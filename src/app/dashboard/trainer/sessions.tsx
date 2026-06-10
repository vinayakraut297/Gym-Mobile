import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, UserCheck } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainerSessionsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const sessions = [
    { id: 1, name: 'Alex Gymer', time: '10:00 AM - 10:45 AM', type: 'Strength Focus', status: 'Completed' },
    { id: 2, name: 'Sam Smith', time: '04:00 PM - 04:45 PM', type: 'Weight Loss Consult', status: 'Pending' },
    { id: 3, name: 'Emily Chen', time: '06:30 PM - 07:15 PM', type: 'Conditioning', status: 'Pending' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Today's Schedule</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Log and mark client session completions.</Text>
        </View>

        <View style={{ gap: 14 }}>
          {sessions.map((sess) => (
            <Card key={sess.id} style={styles.sessionItem}>
              <View style={styles.sessionHeader}>
                <View>
                  <Text style={[styles.sessionClient, { color: colors.text }]}>{sess.name}</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>{sess.type}</Text>
                </View>
                <Badge variant={sess.status === 'Completed' ? 'success' : 'secondary'}>
                  <Text style={{ fontSize: 10, color: sess.status === 'Completed' ? '#fff' : colors.textSecondary, fontWeight: 'bold' }}>
                    {sess.status.toUpperCase()}
                  </Text>
                </Badge>
              </View>

              <View style={styles.timeRow}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>{sess.time}</Text>
              </View>

              {sess.status === 'Pending' && (
                <Button
                  title="Mark Completed"
                  onPress={() => Alert.alert('Session Completed', 'Successfully logged session completion for client.')}
                  style={{ marginTop: 16 }}
                >
                  <UserCheck size={16} color={scheme === 'dark' ? '#000000' : '#ffffff'} style={{ marginRight: 6 }} />
                  <Text style={{ fontWeight: 'bold', color: scheme === 'dark' ? '#000000' : '#ffffff' }}>Complete</Text>
                </Button>
              )}
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
  sessionItem: {
    marginVertical: 0,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionClient: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  timeText: {
    fontSize: 13,
  },
});
