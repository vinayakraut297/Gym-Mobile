import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { TrendingUp, Scale, Plus, Award, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { FloatingAICoach } from '@/components/ui/FloatingAICoach';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [weightLogs, setWeightLogs] = useState([
    { id: 1, date: 'June 08, 2026', weight: '78.5 kg' },
    { id: 2, date: 'June 01, 2026', weight: '79.2 kg' },
    { id: 3, date: 'May 25, 2026', weight: '79.8 kg' },
    { id: 4, date: 'May 18, 2026', weight: '80.5 kg' }
  ]);

  const [weightInput, setWeightInput] = useState('');

  const handleAddLog = () => {
    if (!weightInput) return;
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      weight: `${weightInput} kg`
    };
    setWeightLogs([newLog, ...weightLogs]);
    setWeightInput('');
    Alert.alert('Weight Logged', 'Successfully logged new body weight.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Analytics & Progress</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Visualize your physical growth over time.</Text>
        </View>

        {/* Current Metrics Card */}
        <Card style={styles.metricsCard}>
          <View style={styles.calRow}>
            <View>
              <Text style={[styles.calCount, { color: colors.text }]}>78.5 kg</Text>
              <Text style={[styles.calLabel, { color: colors.textSecondary }]}>CURRENT WEIGHT</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.calTarget, { color: colors.primary }]}>75.0 kg</Text>
              <Text style={[styles.calLabel, { color: colors.textSecondary }]}>GOAL WEIGHT</Text>
            </View>
          </View>
          <Progress value={78.5 - 75 > 0 ? (75 / 78.5) * 100 : 100} style={{ marginVertical: 16 }} />
          <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center' }}>
            You are 2.0 kg away from your target. Good job!
          </Text>
        </Card>

        {/* Dynamic AI insights */}
        <Card style={[styles.aiCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '20' }]}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>📈 AI INSIGHT</Text>
          <Text style={[styles.aiDesc, { color: colors.text }]}>
            "Your weight dropped by 0.7 kg this week while keeping muscle load constant. This indicates fat loss is accelerating. Maintain your daily deficit of 350 kcal."
          </Text>
        </Card>

        {/* Add Weight Log */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ADD NEW WEIGHT LOG</Text>
          <Card style={{ marginVertical: 0 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Input
                placeholder="Weight (e.g. 78.2)"
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="numeric"
                style={{ flex: 1, marginVertical: 0 }}
              />
              <Button
                title="Log weight"
                onPress={handleAddLog}
                disabled={!weightInput}
                style={{ height: 48 }}
              />
            </View>
          </Card>
        </View>

        {/* Weight logs history */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>WEIGHT HISTORY</Text>
          <View style={{ gap: 10 }}>
            {weightLogs.map((log) => (
              <View key={log.id} style={[styles.historyRow, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Scale size={20} color={colors.primary} />
                  <Text style={[styles.logDate, { color: colors.text }]}>{log.date}</Text>
                </View>
                <Text style={[styles.logVal, { color: colors.text }]}>{log.weight}</Text>
              </View>
            ))}
          </View>
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
  metricsCard: {
    marginBottom: 24,
  },
  calRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  calCount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  calTarget: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  calLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  aiCard: {
    padding: 16,
    marginBottom: 24,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  aiDesc: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '300',
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
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  logDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  logVal: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
