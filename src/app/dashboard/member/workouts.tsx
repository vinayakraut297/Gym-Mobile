import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { Play, RotateCcw, Calendar, Check, MoreHorizontal, Target, Wand2, RefreshCcw, Activity, Dumbbell, ClipboardList, TrendingUp } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { FloatingAICoach } from '@/components/ui/FloatingAICoach';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState('Shoulders');

  const upcomingWorkouts = [
    { id: '1', name: 'Upper Body Power', date: 'Today, 6:00 PM', duration: '45 mins', category: 'Strength', exercises: [{name: 'Bench Press', reps: '5x5', rest: '2m', weight: '80kg'}, {name: 'Incline DB Press', reps: '3x10', rest: '90s', weight: '30kg'}, {name: 'Pec Deck', reps: '3x15', rest: '60s', weight: '50kg'}], aiModified: false },
    { id: '2', name: 'Rest Day (Active Recovery)', date: 'Tomorrow', duration: '30 mins', category: 'Recovery', exercises: [{name: 'Light Cycling', reps: '20m', rest: 'None', weight: 'N/A'}, {name: 'Dynamic Stretching', reps: '10m', rest: 'None', weight: 'N/A'}], aiModified: true },
    { id: '3', name: 'Lower Body Strength', date: 'Thursday', duration: '60 mins', category: 'Hypertrophy', exercises: [{name: 'Squats', reps: '4x8', rest: '2m', weight: '100kg'}, {name: 'Leg Press', reps: '3x12', rest: '90s', weight: '150kg'}], aiModified: false },
  ];

  const historyWorkouts = [
    { id: '4', name: 'Pull Day', date: 'Yesterday', duration: '55 mins', category: 'Strength', difficulty: 8, exercises: ['Deadlift 4x5', 'Pullups 3x10', 'Lat Pulldown 3x12'] },
    { id: '5', name: 'Core & Cardio', date: 'Mon, May 12', duration: '40 mins', category: 'Conditioning', difficulty: 6, exercises: ['Plank 3x1m', 'Treadmill Sprints 15m'] },
  ];

  const targetProgram = { 
     id: 'ai-1', name: `${selectedMuscle} AI Focus`, date: 'AI Generated Focus', duration: '40 mins', category: 'Target', exercises: [{name: 'Overhead Press', reps: '4x8', rest: '90s', weight: '50kg'}, {name: 'Lateral Raises', reps: '4x15', rest: '60s', weight: '10kg'}], aiModified: true 
  };

  const displayList = activeTab === 'upcoming' 
    ? (aiGenerated ? [targetProgram, ...upcomingWorkouts] : upcomingWorkouts) 
    : historyWorkouts;

  const handleGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
       setAiGenerating(false);
       setAiGenerated(true);
       setActiveTab('upcoming');
       Alert.alert('FitPulse AI', `${selectedMuscle} target block injected into Mesocycle.`);
    }, 1200);
  };

  const handleStartWorkout = (name: string) => {
    Alert.alert('FitPulse Active', `Starting workout session: ${name}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Training Center</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your micro-cycle is 65% complete.</Text>
          </View>
          <Button
            variant="outline"
            size="sm"
            onPress={() => Alert.alert('Request Sent', 'Your Personal Trainer has been requested to review this cycle.')}
          >
            <ClipboardList size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '600' }}>Review</Text>
          </Button>
        </View>

        {/* Info Cards Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoScroll}>
          <Card style={styles.infoCard}>
            <Text style={[styles.infoLabel, { color: colors.primary }]}>ACTIVE PROGRAM</Text>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Hypertrophy</Text>
            <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>Goal: Strength & Size (W4/8)</Text>
            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>Completion</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text }}>65%</Text>
              </View>
              <Progress value={65} />
            </View>
          </Card>

          <Card style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: '#a855f7' }]}>
            <Text style={[styles.infoLabel, { color: '#a855f7' }]}>AI INSIGHT</Text>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Sleep Score Low</Text>
            <Text style={[styles.infoDesc, { color: colors.textSecondary }]} numberOfLines={3}>
              Tomorrow's workout has been adjusted to Active Recovery to prevent injuries.
            </Text>
          </Card>
        </ScrollView>

        {/* AI Builder Widget */}
        {!aiGenerated && (
          <Card style={[styles.aiCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <Target size={18} color={colors.primary} />
              <Text style={[styles.aiTitle, { color: colors.text }]}>AI Target Builder</Text>
            </View>
            <Text style={[styles.aiDesc, { color: colors.textSecondary }]}>
              Select a muscle and inject a customized micro-cycle block.
            </Text>
            <View style={styles.aiForm}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                {['Shoulders', 'Core', 'Glutes', 'Arms'].map((muscle) => (
                  <Pressable
                    key={muscle}
                    onPress={() => setSelectedMuscle(muscle)}
                    style={[
                      styles.muscleTag,
                      {
                        backgroundColor: selectedMuscle === muscle ? colors.primary : colors.backgroundElement,
                        borderColor: selectedMuscle === muscle ? colors.primary : colors.border
                      }
                    ]}
                  >
                    <Text style={{ color: selectedMuscle === muscle ? (scheme === 'dark' ? '#000' : '#fff') : colors.text, fontSize: 12, fontWeight: 'bold' }}>
                      {muscle}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Button
                title={aiGenerating ? 'Building...' : 'Inject Micro-Cycle'}
                loading={aiGenerating}
                onPress={handleGenerate}
                style={{ marginTop: 12 }}
              />
            </View>
          </Card>
        )}

        {/* Tabs */}
        <View style={[styles.tabsRow, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
          <Pressable
            onPress={() => setActiveTab('upcoming')}
            style={[styles.tabButton, activeTab === 'upcoming' && { backgroundColor: colors.background }]}
          >
            <Text style={[styles.tabText, { color: activeTab === 'upcoming' ? colors.text : colors.textSecondary }]}>
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('history')}
            style={[styles.tabButton, activeTab === 'history' && { backgroundColor: colors.background }]}
          >
            <Text style={[styles.tabText, { color: activeTab === 'history' ? colors.text : colors.textSecondary }]}>
              History
            </Text>
          </Pressable>
        </View>

        {/* Workouts List */}
        <View style={{ gap: 16 }}>
          {displayList.map((workout: any) => (
            <Card
              key={workout.id}
              style={[
                styles.workoutItem,
                workout.aiModified && { borderColor: '#a855f7', borderWidth: 1.5 }
              ]}
            >
              <View style={styles.workoutMeta}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <Badge variant={workout.aiModified ? 'secondary' : 'default'}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: workout.aiModified ? '#a855f7' : (scheme === 'dark' ? '#000' : '#fff') }}>
                      {workout.category}
                    </Text>
                  </Badge>
                  {workout.aiModified && (
                    <Text style={{ fontSize: 11, color: '#a855f7', fontWeight: 'bold' }}>AI MODIFIED</Text>
                  )}
                </View>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  {workout.date}  •  {workout.duration}
                </Text>
              </View>

              <Text style={[styles.workoutName, { color: colors.text }]}>{workout.name}</Text>

              {/* Exercises List */}
              <View style={styles.exercisesList}>
                {workout.exercises.map((ex: any, idx: number) => (
                  <View key={idx} style={[styles.exerciseRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                      <Dumbbell size={14} color={colors.textSecondary} />
                      <Text style={[styles.exName, { color: colors.text }]} numberOfLines={1}>
                        {ex.name || ex}
                      </Text>
                    </View>
                    {ex.reps && (
                      <Text style={[styles.exDetails, { color: colors.textSecondary }]}>
                        {ex.weight}  |  {ex.reps}  |  {ex.rest}
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              {/* Start Button */}
              {activeTab === 'upcoming' ? (
                <View style={styles.workoutFooter}>
                  <Button
                    title="Start Session"
                    onPress={() => handleStartWorkout(workout.name)}
                    style={{ flex: 1, backgroundColor: workout.aiModified ? '#a855f7' : colors.primary }}
                  />
                  <Button
                    title="Modify"
                    variant="outline"
                    onPress={() => Alert.alert('Modify Session', 'Send modification request to coach.')}
                  />
                </View>
              ) : (
                <View style={styles.workoutFooter}>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '600' }}>
                    Completed Successfully
                  </Text>
                  <Button
                    title="View Log"
                    variant="ghost"
                    size="sm"
                    onPress={() => Alert.alert('Log View', 'Workout logged to health database.')}
                  />
                </View>
              )}
            </Card>
          ))}
        </View>
      </ScrollView>
      <FloatingAICoach />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  infoScroll: {
    gap: 12,
    paddingBottom: 16,
  },
  infoCard: {
    width: 250,
    marginVertical: 0,
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  aiCard: {
    marginVertical: 4,
    marginBottom: 24,
    padding: 16,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  aiForm: {
    marginTop: 12,
  },
  muscleTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutItem: {
    marginVertical: 0,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exercisesList: {
    gap: 8,
    marginBottom: 16,
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
  exDetails: {
    fontSize: 12,
  },
  workoutFooter: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc30',
    paddingTop: 14,
  },
});
