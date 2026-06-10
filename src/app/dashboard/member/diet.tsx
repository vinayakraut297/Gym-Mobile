import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { Utensils, Target, Plus, Flame } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Input } from '@/components/ui/Input';
import { FloatingAICoach } from '@/components/ui/FloatingAICoach';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DietScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [dietPref, setDietPref] = useState<'Veg' | 'Non-Veg'>('Veg');
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast', food: 'Oats with Almond Milk & Whey', protein: '30g', kcal: '380' },
    { id: 2, name: 'Lunch', food: 'Paneer Bhurji with 2 Roti & Salad', protein: '28g', kcal: '520' },
    { id: 3, name: 'Dinner', food: 'Tofu stir fry with Jasmine Rice', protein: '25g', kcal: '450' }
  ]);

  const [mealInput, setMealInput] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealKcal, setMealKcal] = useState('');

  const handleAddMeal = () => {
    if (!mealInput) return;
    const newMeal = {
      id: Date.now(),
      name: 'Snack',
      food: mealInput,
      protein: mealProtein ? `${mealProtein}g` : 'N/A',
      kcal: mealKcal || 'N/A'
    };
    setMeals([...meals, newMeal]);
    setMealInput('');
    setMealProtein('');
    setMealKcal('');
    Alert.alert('Meal Logged', 'Meal successfully added to today\'s log.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Diet Tracker</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Power your workouts with optimal nutrition.</Text>
        </View>

        {/* Macros Summary Card */}
        <Card style={styles.macrosCard}>
          <View style={styles.calRow}>
            <View>
              <Text style={[styles.calCount, { color: colors.text }]}>1,350</Text>
              <Text style={[styles.calLabel, { color: colors.textSecondary }]}>KCAL CONSUMED</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.calTarget, { color: colors.primary }]}>2,200</Text>
              <Text style={[styles.calLabel, { color: colors.textSecondary }]}>DAILY BUDGET</Text>
            </View>
          </View>
          <Progress value={(1350 / 2200) * 100} style={{ marginVertical: 16 }} />

          {/* Micro Progress Bars */}
          <View style={styles.macroSplit}>
            <View style={{ flex: 1 }}>
              <View style={styles.macroRow}>
                <Text style={[styles.macroName, { color: colors.text }]}>Protein</Text>
                <Text style={[styles.macroValue, { color: colors.textSecondary }]}>83g / 140g</Text>
              </View>
              <Progress value={59} barStyle={{ backgroundColor: colors.primary }} />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.macroRow}>
                <Text style={[styles.macroName, { color: colors.text }]}>Carbs</Text>
                <Text style={[styles.macroValue, { color: colors.textSecondary }]}>142g / 220g</Text>
              </View>
              <Progress value={64} barStyle={{ backgroundColor: '#22c55e' }} />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.macroRow}>
                <Text style={[styles.macroName, { color: colors.text }]}>Fats</Text>
                <Text style={[styles.macroValue, { color: colors.textSecondary }]}>48g / 70g</Text>
              </View>
              <Progress value={68} barStyle={{ backgroundColor: '#f97316' }} />
            </View>
          </View>
        </Card>

        {/* AI Diet Suggestions */}
        <Card style={[styles.aiCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '20' }]}>
          <Text style={[styles.aiLabel, { color: colors.primary }]}>🥗 AI DIET COACH</Text>
          <Text style={[styles.aiDesc, { color: colors.text }]}>
            "Based on your goal of Muscle Gain, you need 57g more protein today. Add 200g Greek Yogurt or 1 scoop Whey Protein isolate post-workout."
          </Text>
        </Card>

        {/* Meals Logs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TODAY'S MEALS</Text>
          <View style={{ gap: 12 }}>
            {meals.map((meal) => (
              <Card key={meal.id} style={{ marginVertical: 0, padding: 14 }}>
                <View style={styles.mealHeader}>
                  <Text style={[styles.mealName, { color: colors.text }]}>{meal.name}</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '700' }}>{meal.protein}</Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>{meal.kcal} kcal</Text>
                  </View>
                </View>
                <Text style={[styles.mealFood, { color: colors.textSecondary }]}>{meal.food}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Add Meal Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>LOG NEW MEAL</Text>
          <Card style={{ marginVertical: 0 }}>
            <Input
              placeholder="What did you eat?"
              value={mealInput}
              onChangeText={setMealInput}
              style={{ marginVertical: 4 }}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <Input
                placeholder="Protein (g)"
                value={mealProtein}
                onChangeText={setMealProtein}
                keyboardType="numeric"
                style={{ flex: 1, marginVertical: 0 }}
              />
              <Input
                placeholder="Calories"
                value={mealKcal}
                onChangeText={setMealKcal}
                keyboardType="numeric"
                style={{ flex: 1, marginVertical: 0 }}
              />
            </View>
            <Button
              title="Add Meal"
              onPress={handleAddMeal}
              disabled={!mealInput}
              style={{ marginTop: 16 }}
            />
          </Card>
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
  macrosCard: {
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
  macroSplit: {
    gap: 12,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  macroName: {
    fontSize: 13,
    fontWeight: '700',
  },
  macroValue: {
    fontSize: 11,
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealFood: {
    fontSize: 14,
    marginTop: 4,
  },
});
