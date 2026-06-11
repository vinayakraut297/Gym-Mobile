import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building2, Eye, EyeOff, Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

const COLORS = {
  bg: '#0a0a0f',
  card: '#13131a',
  cardBorder: '#1f1f2e',
  text: '#ffffff',
  textSecondary: '#8a8a99',
  textMuted: '#55556a',
  primary: '#d4af37',
  primaryDim: 'rgba(212, 175, 55, 0.12)',
  errorBg: 'rgba(220, 38, 38, 0.1)',
  errorBorder: 'rgba(220, 38, 38, 0.3)',
  errorText: '#ef4444',
  inputBg: '#13131a',
  inputBorder: '#1f1f2e',
};

export default function OwnerSignupScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    try {
      const result = await signup({ name: fullName, email, role: 'owner', password });
      if (result === null) {
        setIsVerificationSent(true);
      } else {
        router.replace('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {isVerificationSent ? (
              <View style={styles.verificationCard}>
                <View style={styles.iconWrapVerify}>
                  <Mail size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.headingVerify}>Verification Sent!</Text>
                <Text style={styles.subtitleVerify}>
                  We've sent a confirmation link to:
                </Text>
                <Text style={styles.emailHighlightVerify}>{email}</Text>
                <Text style={styles.instructionVerify}>
                  Please check your inbox and follow the instructions to verify your account before logging in.
                </Text>
                <Pressable
                  onPress={() => router.replace('/(auth)/login' as any)}
                  style={styles.submitBtn}
                >
                  <Text style={styles.submitText}>Back to Sign In</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* Back */}
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                  <ArrowLeft size={20} color={COLORS.textSecondary} />
                  <Text style={styles.backText}>Back</Text>
                </Pressable>

                {/* Header */}
                <View style={styles.headerSection}>
                  <View style={styles.iconWrap}>
                    <Building2 size={28} color={COLORS.primary} />
                  </View>
                  <Text style={styles.heading}>Create Owner Account</Text>
                  <Text style={styles.subtitle}>Set up your gym management account</Text>
                </View>

                {/* Error */}
                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Form */}
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <Input
                      placeholder="John Doe"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <Input
                      placeholder="john@example.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <Input
                      placeholder="••••••••"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>

                  {/* Submit */}
                  <Pressable
                    onPress={handleSignup}
                    disabled={isLoading}
                    style={({ pressed }) => [
                      styles.submitBtn,
                      pressed && { opacity: 0.85 },
                      isLoading && { opacity: 0.6 },
                    ]}
                  >
                    <Text style={styles.submitText}>
                      {isLoading ? 'Creating Account...' : 'Create Owner Account'}
                    </Text>
                  </Pressable>
                </View>

                {/* Footer links */}
                <View style={styles.footerLinks}>
                  <View style={styles.signInRow}>
                    <Text style={styles.footerLabel}>Already have an account?</Text>
                    <Pressable onPress={() => router.push('/(auth)/login')}>
                      <Text style={styles.signInLink}> Sign In</Text>
                    </Pressable>
                  </View>

                  {/* Divider */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or continue with</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Google */}
                  <Pressable
                    style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.8 }]}
                  >
                    <Text style={styles.googleBtnText}>G</Text>
                    <Text style={styles.googleBtnLabel}>Continue with Google</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.errorText,
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    gap: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 2,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  footerLinks: {
    marginTop: 28,
    alignItems: 'center',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 24,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.cardBorder,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.card,
  },
  googleBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  googleBtnLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  verificationCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 32,
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
  },
  iconWrapVerify: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headingVerify: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitleVerify: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  emailHighlightVerify: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionVerify: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
});
