import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Target, Plus, Dumbbell } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainerWorkoutsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [workoutName, setWorkoutName] = useState('Broad Shoulders Program');
  const [exercises, setExercises] = useState([
    { name: 'Overhead Press', reps: '4x8', weight: '50kg' },
    { name: 'Lateral Raises', reps: '4x15', weight: '10kg' }
  ]);
  const [newExName, setNewExName] = useState('');
  const [newExReps, setNewExReps] = useState('');
  const [newExWeight, setNewExWeight] = useState('');

  const handleAddExercise = () => {
    if (!newExName) return;
    setExercises([...exercises, { name: newExName, reps: newExReps || '3x10', weight: newExWeight || 'N/A' }]);
    setNewExName('');
    setNewExReps('');
    setNewExWeight('');
  };

  const handleSave = () => {
    Alert.alert('Program Saved', 'Successfully updated client workout plan.', [
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
          <Text style={[styles.title, { color: colors.text }]}>Program Planner</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Design structured routines for your clients.</Text>
        </View>

        <Card style={{ marginVertical: 0 }}>
          <Input label="Workout Plan Name" value={workoutName} onChangeText={setWorkoutName} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>EXERCISES</Text>
            <View style={{ gap: 8 }}>
              {exercises.map((ex, idx) => (
                <View key={idx} style={[styles.exerciseRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Dumbbell size={16} color={colors.primary} />
                    <Text style={[styles.exName, { color: colors.text }]}>{ex.name}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>{ex.weight} • {ex.reps}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, { borderTopWidth: 0.5, borderTopColor: '#ccc3', paddingTop: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ADD EXERCISE</Text>
            <Input placeholder="Exercise name" value={newExName} onChangeText={setNewExName} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <Input placeholder="Weight" value={newExWeight} onChangeText={setNewExWeight} style={{ flex: 1, marginVertical: 0 }} />
              <Input placeholder="Reps (e.g. 3x10)" value={newExReps} onChangeText={setNewExReps} style={{ flex: 1, marginVertical: 0 }} />
            </View>
            <Button title="Add to Routine" variant="outline" onPress={handleAddExercise} style={{ marginTop: 16 }} />
          </View>

          <Button title="Publish Workout Plan" onPress={handleSave} style={{ marginTop: 32 }} />
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
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  exName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
