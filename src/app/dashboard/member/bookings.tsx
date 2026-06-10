import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [bookedClass, setBookedClass] = useState<string | null>(null);

  const classes = [
    { id: 1, name: 'Powerlifting Base', time: 'Today, 7:00 PM', coach: 'Mike Coach', slots: '2 slots left' },
    { id: 2, name: 'High Intensity Cardio', time: 'Tomorrow, 8:30 AM', coach: 'Jen Fitness', slots: '5 slots left' },
    { id: 3, name: 'Vinyasa Flow Yoga', time: 'Thursday, 6:00 PM', coach: 'Jen Fitness', slots: '10 slots left' }
  ];

  const handleBook = (name: string) => {
    Alert.alert('Class Booked', `Successfully reserved slot in ${name}.`, [
      { text: 'OK', onPress: () => setBookedClass(name) }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Class Bookings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Reserve slots for trainer sessions.</Text>
        </View>

        {bookedClass && (
          <Card style={[styles.bookingItem, { borderColor: '#22c55e', backgroundColor: '#22c55e08' }]}>
            <Text style={{ fontSize: 13, color: '#22c55e', fontWeight: 'bold', marginBottom: 4 }}>CONFIRMED BOOKING</Text>
            <Text style={[styles.className, { color: colors.text }]}>{bookedClass}</Text>
            <Text style={{ fontSize: 13, marginTop: 4, color: colors.textSecondary }}>Check-in via Entry Pass 15 mins before.</Text>
          </Card>
        )}

        <View style={{ gap: 14 }}>
          {classes.map((cls) => (
            <Card key={cls.id} style={styles.bookingItem}>
              <Text style={[styles.className, { color: colors.text }]}>{cls.name}</Text>
              <View style={styles.metaRow}>
                <Clock size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{cls.time}</Text>
              </View>
              <View style={styles.metaRow}>
                <MapPin size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>Coach: {cls.coach}  •  {cls.slots}</Text>
              </View>

              <Button
                title="Book Slot"
                onPress={() => handleBook(cls.name)}
                disabled={bookedClass === cls.name}
                style={{ marginTop: 16 }}
              />
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
  bookingItem: {
    marginVertical: 0,
    padding: 16,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  metaText: {
    fontSize: 13,
  },
});
