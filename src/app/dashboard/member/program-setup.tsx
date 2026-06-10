import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Target } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgramSetupScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const { user, updateUser } = useAuth();
  const [goal, setGoal] = useState(user?.goal || 'Muscle Gain');
  const [weight, setWeight] = useState('78');
  const [weeks, setWeeks] = useState('8');

  const handleSave = () => {
    updateUser({ goal });
    Alert.alert('AI Target Setup', `Configured target program for ${goal} over ${weeks} weeks. FitPulse AI has adjusted your recovery logs.`, [
      { text: 'View Workouts', onPress: () => router.push('/dashboard/member/workouts') }
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
          <Text style={[styles.title, { color: colors.text }]}>Goal Configurator</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Tune the FitPulse AI training engine.</Text>
        </View>

        <Card style={{ marginVertical: 0 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <Target size={18} color={colors.primary} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>AI Target Mesocycle</Text>
          </View>

          <View style={{ gap: 8, marginBottom: 16 }}>
            {['Fat Loss', 'Muscle Gain', 'Endurance', 'General Wellness'].map((g) => (
              <Pressable
                key={g}
                onPress={() => setGoal(g)}
                style={[
                  styles.goalCard,
                  {
                    borderColor: goal === g ? colors.primary : colors.border,
                    backgroundColor: goal === g ? colors.primary + '08' : colors.backgroundElement
                  }
                ]}
              >
                <Text style={{ color: goal === g ? colors.primary : colors.text, fontWeight: 'bold' }}>{g}</Text>
              </Pressable>
            ))}
          </View>

          <Input label="Target Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          <Input label="Cycle Length (Weeks)" value={weeks} onChangeText={setWeeks} keyboardType="numeric" />

          <Button title="Regenerate Training Cycle" onPress={handleSave} style={{ marginTop: 24 }} />
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
  goalCard: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
