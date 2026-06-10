import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HealthScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [water, setWater] = useState(2.1);
  const target = 3.0;

  const handleAddWater = (amount: number) => {
    const newVal = Math.round((water + amount) * 10) / 10;
    setWater(newVal);
    Alert.alert('Hydration Ingested', `Logged ${amount}L of water.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Hydration Logger</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track your daily fluid intake goals.</Text>
        </View>

        <Card style={styles.waterCard}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>💧</Text>
          <Text style={[styles.waterTitle, { color: colors.text }]}>{water}L / {target}L</Text>
          <Text style={[styles.waterLabel, { color: colors.textSecondary }]}>DAILY HYDRATION PROGRESS</Text>
          <Progress value={(water / target) * 100} style={{ marginVertical: 20 }} />

          <View style={styles.waterButtons}>
            <Button title="+250ml" variant="outline" onPress={() => handleAddWater(0.25)} style={{ flex: 1 }} />
            <Button title="+500ml" variant="outline" onPress={() => handleAddWater(0.5)} style={{ flex: 1 }} />
            <Button title="+1.0L" onPress={() => handleAddWater(1.0)} style={{ flex: 1 }} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Pressable } from 'react-native';

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
  waterCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  waterTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  waterLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  waterButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
});
