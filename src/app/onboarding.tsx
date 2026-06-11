import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, CheckCircle2, ChevronRight, Paintbrush, Wand2, CreditCard, Users, Target } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);

  // States for owner onboarding
  const [gymName, setGymName] = useState('');
  const [brandColor, setBrandColor] = useState('#cda34f');

  // States for member onboarding
  const [goal, setGoal] = useState('');

  if (!user) return null;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => (s > 1 ? s - 1 : 1));

  const finishOnboarding = () => {
    updateUser({ onboarded: true, goal, branch: gymName || 'FitPulse Elite' });
    const targetRole = (user.role === 'super_admin' ? 'owner' : user.role) as 'owner' | 'trainer' | 'member';
    router.replace(`/dashboard/${targetRole}`);
  };

  const renderOwnerOnboarding = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Activity size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome to FitPulse OS</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              The central nervous system for your gym business. Let's get you set up to scale.
            </Text>

            <View style={styles.listContainer}>
              <View style={styles.listItem}>
                <CheckCircle2 size={18} color={colors.primary} />
                <Text style={[styles.listText, { color: colors.text }]}>Manage unlimited branches</Text>
              </View>
              <View style={styles.listItem}>
                <CheckCircle2 size={18} color={colors.primary} />
                <Text style={[styles.listText, { color: colors.text }]}>AI driven retention & churn tracking</Text>
              </View>
              <View style={styles.listItem}>
                <CheckCircle2 size={18} color={colors.primary} />
                <Text style={[styles.listText, { color: colors.text }]}>Automated WhatsApp follow-ups</Text>
              </View>
            </View>

            <Button title="Continue" onPress={nextStep} style={styles.primaryBtn} />
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.secondary }]}>
              <Paintbrush size={32} color={colors.text} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Make it Yours</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Configure your gym's brand identity. This reflects in the app for your members.
            </Text>

            <View style={{ marginVertical: 20, width: '100%' }}>
              <Input
                label="Gym Name"
                placeholder="e.g. Iron Addicts Gym"
                value={gymName}
                onChangeText={setGymName}
                autoCapitalize="words"
              />

              <Input
                label="Brand Primary Color (HEX)"
                placeholder="#cda34f"
                value={brandColor}
                onChangeText={setBrandColor}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.navigationRow}>
              <Button variant="ghost" title="Back" onPress={prevStep} />
              <Button title="Next Step" onPress={nextStep} disabled={!gymName} />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.secondary }]}>
              <Users size={32} color={colors.text} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Your Ecosystem</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Add trainers and members to your platform easily via links or manual entry.
            </Text>

            <View style={styles.gridContainer}>
              <View style={[styles.gridItem, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Text style={[styles.gridTitle, { color: colors.text }]}>Invite Trainers</Text>
                <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>
                  Send an invite link. Trainers can manage multiple clients.
                </Text>
              </View>
              <View style={[styles.gridItem, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Text style={[styles.gridTitle, { color: colors.text }]}>Invite Members</Text>
                <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>
                  Members get a custom branded app experience when they join.
                </Text>
              </View>
            </View>

            <View style={styles.navigationRow}>
              <Button variant="ghost" title="Back" onPress={prevStep} />
              <Button title="Payment Setup" onPress={nextStep} />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.secondary }]}>
              <CreditCard size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Lifetime Activation</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              A simple, transparent pricing model for gym owners.
            </Text>

            <View style={[styles.pricingCard, { borderColor: colors.primary, backgroundColor: colors.primary + '08' }]}>
              <Text style={styles.pricingTag}>ONE TIME PAYMENT</Text>
              <Text style={[styles.price, { color: colors.text }]}>₹4,999</Text>
              <View style={styles.pricingListItem}>
                <CheckCircle2 size={16} color={colors.primary} />
                <Text style={[styles.pricingListText, { color: colors.text }]}>Full Admin Command Center</Text>
              </View>
              <View style={styles.pricingListItem}>
                <CheckCircle2 size={16} color={colors.primary} />
                <Text style={[styles.pricingListText, { color: colors.text }]}>Branded App for your Members</Text>
              </View>
              <View style={styles.pricingListItem}>
                <CheckCircle2 size={16} color={colors.primary} />
                <Text style={[styles.pricingListText, { color: colors.text }]}>Up to 100 members free forever</Text>
              </View>
            </View>

            <View style={styles.navigationRow}>
              <Button variant="ghost" title="Back" onPress={prevStep} />
              <Button title="Start Free Trial" onPress={nextStep} />
            </View>
          </View>
        );
      case 5:
        return (
          <View style={[styles.card, { alignItems: 'center' }]}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.primary, width: 80, height: 80, borderRadius: 40 }]}>
              <CheckCircle2 size={40} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
            </View>
            <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>You're All Set!</Text>
            <Text style={[styles.desc, { color: colors.textSecondary, textAlign: 'center' }]}>
              Your gym ecosystem is ready. You can now invite trainers and members.
            </Text>
            <Button title="Go to Dashboard" onPress={finishOnboarding} style={[styles.primaryBtn, { marginTop: 40 }]} />
          </View>
        );
      default:
        return null;
    }
  };

  const renderMemberOnboarding = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Activity size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome to FitPulse</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Your personal fitness operating system. Track, grow, and achieve your goals with AI.
            </Text>
            <Button title="Let's Go" onPress={nextStep} style={styles.primaryBtn} />
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.secondary }]}>
              <Wand2 size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Meet your AI Coach</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              FitPulse uses AI to analyze your performance and suggest optimal diet and recovery strategies.
            </Text>

            <View style={{ marginVertical: 20, gap: 12, width: '100%' }}>
              <View style={[styles.infoRow, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Activity size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Daily Growth Scoring</Text>
                  <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>Sleep, diet, and training feedback.</Text>
                </View>
              </View>
              <View style={[styles.infoRow, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Target size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Dynamic Targets</Text>
                  <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>Weekly goals adjusted based on progress.</Text>
                </View>
              </View>
            </View>

            <View style={styles.navigationRow}>
              <Button variant="ghost" title="Back" onPress={prevStep} />
              <Button title="Next" onPress={nextStep} />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.secondary }]}>
              <Target size={32} color={colors.text} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Set your Goal</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>What are you optimizing for?</Text>

            <View style={{ marginVertical: 20, gap: 12, width: '100%' }}>
              {['Fat Loss', 'Muscle Gain', 'Endurance', 'General Wellness'].map((g) => (
                <Pressable
                  key={g}
                  onPress={() => setGoal(g)}
                  style={[
                    styles.goalCard,
                    {
                      borderColor: goal === g ? colors.primary : colors.border,
                      backgroundColor: goal === g ? colors.primary + '10' : colors.backgroundElement
                    }
                  ]}
                >
                  <Text style={[styles.goalText, { color: goal === g ? colors.primary : colors.text }]}>{g}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.navigationRow}>
              <Button variant="ghost" title="Back" onPress={prevStep} />
              <Button title="Next" onPress={nextStep} disabled={!goal} />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={[styles.card, { alignItems: 'center' }]}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.primary, width: 80, height: 80, borderRadius: 40 }]}>
              <CheckCircle2 size={40} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
            </View>
            <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Ready to Grow</Text>
            <Text style={[styles.desc, { color: colors.textSecondary, textAlign: 'center' }]}>
              Your profile is configured for {goal}. You can connect with your local gym from your dashboard.
            </Text>
            <Button title="Explore Dashboard" onPress={finishOnboarding} style={[styles.primaryBtn, { marginTop: 40 }]} />
          </View>
        );
      default:
        return null;
    }
  };

  const renderTrainerOnboarding = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Activity size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome, Coach</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Your centralized platform to train clients, track progress, and grow your career across multiple gyms.
            </Text>
            <Button title="Get Started" onPress={nextStep} style={styles.primaryBtn} />
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.secondary }]}>
              <Wand2 size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>AI-Powered Programming</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              10x your client capacity with smart tools that help you build, adapt, and scale workout programs.
            </Text>

            <View style={{ marginVertical: 20, gap: 12, width: '100%' }}>
              <View style={[styles.infoRow, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Wand2 size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Program Generation</Text>
                  <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>Instantly draft multi-week training blocks.</Text>
                </View>
              </View>
              <View style={[styles.infoRow, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Activity size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Form Analysis & Insights</Text>
                  <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>Review client biomechanics automatically.</Text>
                </View>
              </View>
            </View>

            <View style={styles.navigationRow}>
              <Button variant="ghost" title="Back" onPress={prevStep} />
              <Button title="Next" onPress={nextStep} />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.secondary }]}>
              <Users size={32} color={colors.text} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Client Management</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Operate independently or join a facility's roster in seconds.
            </Text>

            <View style={styles.gridContainer}>
              <View style={[styles.gridItem, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Text style={[styles.gridTitle, { color: colors.text }]}>Connect to Gyms</Text>
                <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>
                  Accept invites from partner facilities to train members on the platform.
                </Text>
              </View>
              <View style={[styles.gridItem, { borderColor: colors.border, backgroundColor: colors.backgroundElement }]}>
                <Text style={[styles.gridTitle, { color: colors.text }]}>Independent clients</Text>
                <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>
                  Invite private clients and manage their billing directly.
                </Text>
              </View>
            </View>

            <View style={styles.navigationRow}>
              <Button variant="ghost" title="Back" onPress={prevStep} />
              <Button title="Next" onPress={nextStep} />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={[styles.card, { alignItems: 'center' }]}>
            <View style={[styles.stepIconContainer, { backgroundColor: colors.primary, width: 80, height: 80, borderRadius: 40 }]}>
              <CheckCircle2 size={40} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
            </View>
            <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Ready to Coach!</Text>
            <Text style={[styles.desc, { color: colors.textSecondary, textAlign: 'center' }]}>
              Your trainer profile is set up. Let's start building your client base and programs.
            </Text>
            <Button title="Enter Dashboard" onPress={finishOnboarding} style={[styles.primaryBtn, { marginTop: 40 }]} />
          </View>
        );
      default:
        return null;
    }
  };

  const getDotsCount = () => (user.role === 'owner' ? 5 : 4);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress dots */}
        <View style={styles.dotsRow}>
          {Array.from({ length: getDotsCount() }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: step >= i + 1 ? colors.primary : colors.muted,
                  width: step === i + 1 ? 24 : 8,
                }
              ]}
            />
          ))}
        </View>

        {user.role === 'owner' && renderOwnerOnboarding()}
        {user.role === 'member' && renderMemberOnboarding()}
        {user.role === 'trainer' && renderTrainerOnboarding()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'flex-start',
  },
  stepIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  listContainer: {
    gap: 12,
    marginVertical: 12,
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listText: {
    fontSize: 15,
    fontWeight: '500',
  },
  primaryBtn: {
    width: '100%',
    height: 50,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 32,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  gridDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  pricingCard: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    marginVertical: 16,
  },
  pricingTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#cca34f',
    letterSpacing: 1,
    marginBottom: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 16,
  },
  pricingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  pricingListText: {
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  infoDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  goalCard: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
