import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserCheck } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MemberAddScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Muscle Gain');

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    Alert.alert('Enrollment Complete', `Member ${name} added successfully. fitpulse API database updated.`, [
      { text: 'OK', onPress: () => router.back() }
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
          <Text style={[styles.title, { color: colors.text }]}>New Admission</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enroll a new member into your community.</Text>
        </View>

        <Card style={{ marginVertical: 0 }}>
          <Input label="Full Name" placeholder="Alex Gymer" value={name} onChangeText={setName} autoCapitalize="words" />
          <Input label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label="Phone Number" placeholder="+91 98765 43210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label="Fitness Goal" placeholder="Muscle Gain / Weight Loss" value={goal} onChangeText={setGoal} />

          <Button title="Register Member" onPress={handleSave} style={{ marginTop: 24 }} />
        </Card>
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
});
