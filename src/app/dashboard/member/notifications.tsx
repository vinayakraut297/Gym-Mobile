import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Star, Dumbbell } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const notifications = [
    { id: 1, title: 'Session Rescheduled', desc: 'Trainer Mike has moved your Upper Body Power class to 6:30 PM.', date: '10 mins ago', type: 'workout' },
    { id: 2, title: 'Hydration Target Near', desc: 'You are only 0.9L away from reaching today\'s target.', date: '2 hours ago', type: 'health' },
    { id: 3, title: 'Mesocycle Complete!', desc: 'Congratulations! You completed the hypertrophy block.', date: 'Yesterday', type: 'trophy' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Recent updates from your gym & coach.</Text>
        </View>

        <View style={{ gap: 12 }}>
          {notifications.map((notif) => (
            <Card key={notif.id} style={{ marginVertical: 0, padding: 16 }}>
              <View style={styles.notifHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Bell size={18} color={colors.primary} />
                  <Text style={[styles.notifTitle, { color: colors.text }]}>{notif.title}</Text>
                </View>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>{notif.date}</Text>
              </View>
              <Text style={[styles.notifDesc, { color: colors.textSecondary }]}>{notif.desc}</Text>
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
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notifDesc: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
