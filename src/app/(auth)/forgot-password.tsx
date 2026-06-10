import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, ArrowLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    if (!email) return;
    setSuccess(true);
    setTimeout(() => {
      router.push({ pathname: '/(auth)/verify-otp', params: { email } });
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.brandContainer}>
          <View style={[styles.logoBg, { backgroundColor: colors.primary }]}>
            <Activity size={28} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We will send a verification OTP code to your email
          </Text>
        </View>

        {success ? (
          <View style={[styles.successBox, { backgroundColor: '#22c55e15', borderColor: '#22c55e30' }]}>
            <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
              OTP code sent! Redirecting to verification...
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Button
              title="Send Verification Code"
              onPress={handleReset}
              disabled={!email}
              style={styles.submitButton}
            />
          </View>
        )}
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
  successBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  form: {
    alignSelf: 'stretch',
  },
  submitButton: {
    marginTop: 24,
    height: 50,
  },
});
