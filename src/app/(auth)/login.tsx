import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, ArrowLeft, MonitorPlay, Lock } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Kiosk dialog states
  const [showKioskUnlock, setShowKioskUnlock] = useState(false);
  const [kioskEmail, setKioskEmail] = useState('');
  const [kioskPassword, setKioskPassword] = useState('');

  const handleLogin = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    try {
      const user = await login(email);
      router.replace(user.onboarded ? `/dashboard/${user.role}` : '/onboarding');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleKioskUnlock = async () => {
    if (!kioskEmail) {
      setError('Please enter your email');
      return;
    }
    setError('');
    try {
      const user = await login(kioskEmail);
      if (user.role === 'owner') {
        setShowKioskUnlock(false);
        router.replace('/kiosk');
      } else {
        setError('Only gym owners can unlock Kiosk mode.');
      }
    } catch (err: any) {
      setError(err.message || 'Unlock failed');
    }
  };

  const loginAs = async (testEmail: string) => {
    setError('');
    if (showKioskUnlock) {
      setKioskEmail(testEmail);
      setKioskPassword('password');
      try {
        const user = await login(testEmail);
        if (user.role === 'owner') {
          setShowKioskUnlock(false);
          router.replace('/kiosk');
        } else {
          setError('Only gym owners can unlock Kiosk mode.');
        }
      } catch (err: any) {
        setError(err.message || 'Unlock failed');
      }
      return;
    }

    setEmail(testEmail);
    setPassword('password');
    try {
      const user = await login(testEmail);
      router.replace(user.onboarded ? `/dashboard/${user.role}` : '/onboarding');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable onPress={() => router.replace('/(auth)/landing')} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        {/* Brand */}
        <View style={styles.brandContainer}>
          <View style={[styles.logoBg, { backgroundColor: colors.primary }]}>
            <Activity size={28} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Sign In</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your credentials to access your FitPulse OS
          </Text>
        </View>

        {/* Error Box */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive + '30' }]}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        {/* Inputs */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.pwdHeader}>
            <Text style={[styles.pwdLabel, { color: colors.text }]}>Password</Text>
            <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
            </Pressable>
          </View>
          <Input
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title={isLoading ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        {/* Demo Accounts */}
        <View style={[styles.demoContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.demoHeader, { color: colors.textSecondary }]}>DEMO ACCOUNTS</Text>
          <View style={styles.demoButtons}>
            <Pressable onPress={() => loginAs('sarah@fitpulse.ai')} style={[styles.demoBtn, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.demoBtnText, { color: colors.text }]}>Owner</Text>
            </Pressable>
            <Pressable onPress={() => loginAs('mike@fitpulse.ai')} style={[styles.demoBtn, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.demoBtnText, { color: colors.text }]}>Trainer</Text>
            </Pressable>
            <Pressable onPress={() => loginAs('alex@example.com')} style={[styles.demoBtn, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.demoBtnText, { color: colors.text }]}>Member</Text>
            </Pressable>
          </View>
        </View>

        {/* Kiosk Mode Activation */}
        <View style={styles.kioskContainer}>
          <Button
            variant="outline"
            onPress={() => setShowKioskUnlock(true)}
            style={[styles.kioskButton, { borderColor: colors.primary }]}
          >
            <MonitorPlay size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Launch Secure Kiosk</Text>
          </Button>
        </View>
      </ScrollView>

      {/* Kiosk Unlock Modal */}
      <Dialog open={showKioskUnlock} onOpenChange={setShowKioskUnlock}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Lock size={18} color={colors.primary} />
              <Text> Unlock Kiosk Mode</Text>
            </DialogTitle>
            <DialogDescription>
              Please enter your Owner credentials to launch the secure full-screen attendance kiosk.
            </DialogDescription>
          </DialogHeader>

          <View style={{ marginVertical: 12 }}>
            <Input
              label="Owner Email"
              placeholder="owner@fitpulse.ai"
              value={kioskEmail}
              onChangeText={setKioskEmail}
              keyboardType="email-address"
            />
            <Input
              label="Password"
              placeholder="••••••••"
              value={kioskPassword}
              onChangeText={setKioskPassword}
              secureTextEntry
            />
          </View>

          <DialogFooter>
            <Button variant="ghost" title="Cancel" onPress={() => setShowKioskUnlock(false)} />
            <Button title="Unlock Kiosk" loading={isLoading} onPress={handleKioskUnlock} />
          </DialogFooter>

          <Pressable onPress={() => loginAs('sarah@fitpulse.ai')} style={styles.quickOwnerLink}>
            <Text style={{ color: colors.primary, fontSize: 13, textDecorationLine: 'underline' }}>
              Quick login as Owner
            </Text>
          </Pressable>
        </DialogContent>
      </Dialog>
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
  pwdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pwdLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 24,
    height: 50,
  },
  demoContainer: {
    marginTop: 32,
    borderTopWidth: 0.5,
    paddingTop: 24,
    alignItems: 'center',
  },
  demoHeader: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
  },
  demoBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  kioskContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  kioskButton: {
    borderWidth: 1.5,
    borderRadius: 99,
    height: 50,
    width: '100%',
  },
  quickOwnerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
});
