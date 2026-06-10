import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, ArrowRight, UserCircle, Building2, ChevronRight, Dumbbell } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [showIndividualSubMenu, setShowIndividualSubMenu] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Branding */}
        <View style={styles.brandContainer}>
          <View style={[styles.logoBg, { backgroundColor: colors.primary }]}>
            <Activity size={24} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
          </View>
          <Text style={[styles.brandText, { color: colors.text }]}>
            FitPulse<Text style={{ color: colors.primary }}>Universal</Text>
          </Text>
        </View>

        {/* Hero */}
        <View style={styles.heroContainer}>
          <Text style={[styles.heroHeading, { color: colors.text }]}>
            THE GYM{'\n'}
            <Text style={{ color: colors.textSecondary }}>OPERATING</Text>{'\n'}
            SYSTEM.
          </Text>
          <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
            A single platform for owners to scale, trainers to coach, and members to grow. Join the fitness revolution.
          </Text>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuContainer}>
          {!showIndividualSubMenu ? (
            <View style={styles.fadeContainer}>
              <Pressable
                onPress={() => setShowIndividualSubMenu(true)}
                style={({ pressed }) => [
                  styles.optionCard,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border, opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <View style={styles.cardHeaderSide}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                    <UserCircle size={24} color={colors.text} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>For Individuals</Text>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Track your health, workouts & diet</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </Pressable>

              <Pressable
                onPress={() => router.push({ pathname: '/(auth)/signup', params: { role: 'owner' } })}
                style={({ pressed }) => [
                  styles.optionCard,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border, opacity: pressed ? 0.9 : 1, marginTop: 12 }
                ]}
              >
                <View style={styles.cardHeaderSide}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                    <Building2 size={24} color={colors.text} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>For Gym Owners</Text>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Manage and scale your facility</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.fadeContainer}>
              <Pressable
                onPress={() => setShowIndividualSubMenu(false)}
                style={styles.backButton}
              >
                <Text style={{ color: colors.primary, fontWeight: '600' }}>← Back to options</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push({ pathname: '/(auth)/signup', params: { role: 'member' } })}
                style={({ pressed }) => [
                  styles.optionCard,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border, opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <View style={styles.cardHeaderSide}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                    <UserCircle size={24} color={colors.text} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Join as Member</Text>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Track progress & connect with your gym</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </Pressable>

              <Pressable
                onPress={() => router.push({ pathname: '/(auth)/signup', params: { role: 'trainer' } })}
                style={({ pressed }) => [
                  styles.optionCard,
                  { backgroundColor: colors.backgroundElement, borderColor: colors.border, opacity: pressed ? 0.9 : 1, marginTop: 12 }
                ]}
              >
                <View style={styles.cardHeaderSide}>
                  <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                    <Dumbbell size={24} color={colors.text} />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>Join as Trainer</Text>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Manage clients, programs & career</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Footer Actions */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account?</Text>
          <Button
            variant="outline"
            onPress={() => router.push('/(auth)/login')}
            style={styles.signInBtn}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>Sign In </Text>
            <ArrowRight size={16} color={colors.text} />
          </Button>
        </View>

        <View style={styles.badgeContainer}>
          <Text style={[styles.badgeText, { color: colors.textSecondary }]}>INDIA FIRST  •  AI POWERED</Text>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  logoBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroContainer: {
    marginVertical: 40,
  },
  heroHeading: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 46,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  fadeContainer: {
    width: '100%',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeaderSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    borderTopWidth: 0.5,
  },
  footerText: {
    fontSize: 14,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 99,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
