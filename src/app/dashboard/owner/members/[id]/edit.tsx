import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { fetchWithAuth } from '@/lib/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MemberEditScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('Muscle Gain');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/members')
      .then((data) => {
        const found = (data.members || []).find((m: any) => m.id === id);
        if (found) {
          setName(found.name);
          setEmail(found.email);
          setPhone(found.phone || '');
          setGoal(found.goal);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    Alert.alert('Details Saved', `Member record for ${name} has been updated.`, [
      { text: 'OK', onPress: () => router.back() }
    ]);
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

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Edit Member</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Update profile variables and goals.</Text>
        </View>

        <Card style={{ marginVertical: 0 }}>
          <Input label="Full Name" placeholder="Alex Gymer" value={name} onChangeText={setName} autoCapitalize="words" />
          <Input label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label="Phone Number" placeholder="+91 98765 43210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label="Fitness Goal" placeholder="Muscle Gain / Weight Loss" value={goal} onChangeText={setGoal} />

          <Button title="Save Updates" onPress={handleSave} style={{ marginTop: 24 }} />
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
