import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Activity, ArrowLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialRole = (params.role as 'owner' | 'trainer' | 'member') || 'member';

  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'trainer' | 'member'>(initialRole);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    try {
      const user = await signup({ name, email, role });
      router.replace('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back */}
        <Pressable onPress={() => router.replace('/(auth)/landing')} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        {/* Brand */}
        <View style={styles.brandContainer}>
          <View style={[styles.logoBg, { backgroundColor: colors.primary }]}>
            <Activity size={28} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join the FitPulse OS fitness community
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive + '30' }]}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Alex Gymer"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Role Picker */}
          <Text style={[styles.roleLabel, { color: colors.text }]}>I want to join as a:</Text>
          <View style={styles.roleContainer}>
            {(['member', 'trainer', 'owner'] as const).map((r) => (
              <Pressable
                key={r}
                onPress={() => setRole(r)}
                style={[
                  styles.roleCard,
                  {
                    backgroundColor: role === r ? colors.primary + '15' : colors.backgroundElement,
                    borderColor: role === r ? colors.primary : colors.border
                  }
                ]}
              >
                <Text
                  style={[
                    styles.roleCardText,
                    { color: role === r ? colors.primary : colors.text }
                  ]}
                >
                  {r.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button
            title={isLoading ? 'Creating account...' : 'Sign Up'}
            onPress={handleSignup}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Link to login */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign In</Text>
          </Pressable>
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
    paddingHorizontal: 24,
    paddingTop: 16,
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
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    alignSelf: 'stretch',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  submitButton: {
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
  },
});
