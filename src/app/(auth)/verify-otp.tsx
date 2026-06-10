import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Activity, ArrowLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyOtpScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || 'your email';

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = () => {
    if (otp.length < 4 || !newPassword) return;
    setSuccess(true);
    setTimeout(() => {
      router.replace('/(auth)/login');
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
          <Text style={[styles.title, { color: colors.text }]}>Enter OTP</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We've sent a 4-digit code to {email}
          </Text>
        </View>

        {success ? (
          <View style={[styles.successBox, { backgroundColor: '#22c55e15', borderColor: '#22c55e30' }]}>
            <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
              Password updated successfully! Redirecting to login...
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              label="OTP Code (4 digits)"
              placeholder="1234"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />

            <Input
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Button
              title="Verify & Reset"
              onPress={handleVerify}
              disabled={otp.length < 4 || !newPassword}
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
