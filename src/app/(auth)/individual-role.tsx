import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Dumbbell, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  bg: '#0a0a0f',
  card: '#13131a',
  cardBorder: '#1f1f2e',
  cardHover: '#1a1a28',
  text: '#ffffff',
  textSecondary: '#8a8a99',
  textMuted: '#55556a',
  primary: '#d4af37',
  primaryDim: 'rgba(212, 175, 55, 0.12)',
};

export default function IndividualRoleScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card1Slide = useRef(new Animated.Value(30)).current;
  const card2Slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.stagger(100, [
        Animated.parallel([
          Animated.timing(card1Anim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(card1Slide, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(card2Anim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(card2Slide, { toValue: 0, duration: 350, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        {/* Header with back */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color={COLORS.textSecondary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.heading}>Get Started</Text>
          <Text style={styles.subtitle}>Select your role to continue.</Text>
        </Animated.View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {/* Member */}
          <Animated.View style={{ opacity: card1Anim, transform: [{ translateY: card1Slide }] }}>
            <Pressable
              onPress={() => router.push('/(auth)/member-signup' as any)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.cardInner}>
                <View style={styles.cardIconWrap}>
                  <User size={26} color={COLORS.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Join as Member</Text>
                  <Text style={styles.cardSubtitle}>Track your progress and connect with your gym</Text>
                </View>
                <View style={styles.cardArrow}>
                  <ChevronRight size={20} color={COLORS.textMuted} />
                </View>
              </View>
            </Pressable>
          </Animated.View>

          {/* Trainer */}
          <Animated.View style={{ opacity: card2Anim, transform: [{ translateY: card2Slide }] }}>
            <Pressable
              onPress={() => router.push('/(auth)/trainer-signup' as any)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.cardInner}>
                <View style={styles.cardIconWrap}>
                  <Dumbbell size={26} color={COLORS.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Join as Trainer</Text>
                  <Text style={styles.cardSubtitle}>Manage clients, programs, and career</Text>
                </View>
                <View style={styles.cardArrow}>
                  <ChevronRight size={20} color={COLORS.textMuted} />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <View style={styles.footerDivider} />
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              style={({ pressed }) => [styles.signInBtn, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.signInText}>Sign In</Text>
              <ArrowRight size={16} color={COLORS.primary} />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 28,
  },
  backText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: COLORS.cardHover,
    transform: [{ scale: 0.985 }],
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingBottom: 16,
  },
  footerDivider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.card,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
