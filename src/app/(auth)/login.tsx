import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Activity } from 'lucide-react-native';
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
};

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    try {
      const user = await login(email, password);
      const targetRole = (user.role === 'super_admin' ? 'owner' : user.role) as 'owner' | 'trainer' | 'member';
      router.replace(user.onboarded ? `/dashboard/${targetRole}` : '/onboarding');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const user = await loginWithGoogle('member');
      if (user) {
        const targetRole = (user.role === 'super_admin' ? 'owner' : user.role) as 'owner' | 'trainer' | 'member';
        router.replace(user.onboarded ? `/dashboard/${targetRole}` : '/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
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
            {/* Back */}
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={20} color={COLORS.textSecondary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.headerSection}>
              <View style={styles.iconWrap}>
                <Activity size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
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
                <Text style={styles.label}>Email</Text>
                <Input
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.passwordHeader}>
                  <Text style={styles.label}>Password</Text>
                  <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                    <Text style={styles.forgotLink}>Forgot password?</Text>
                  </Pressable>
                </View>
                <Input
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <Pressable
                onPress={handleLogin}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && { opacity: 0.85 },
                  isLoading && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.submitText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footerLinks}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                onPress={handleGoogleLogin}
                disabled={isLoading}
                style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.8 }, isLoading && { opacity: 0.6 }]}
              >
                <Text style={styles.googleBtnText}>G</Text>
                <Text style={styles.googleBtnLabel}>Continue with Google</Text>
              </Pressable>

              <View style={styles.signUpRow}>
                <Text style={styles.footerLabel}>Don't have an account?</Text>
                <Pressable onPress={() => router.push('/(auth)/landing')}>
                  <Text style={styles.signUpLink}> Get Started</Text>
                </Pressable>
              </View>
            </View>
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
    fontSize: 28,
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 2,
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
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
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  footerLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
