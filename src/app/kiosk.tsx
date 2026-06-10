import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, ScanQrCode, UserCheck } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KioskScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [memberId, setMemberId] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  const handleCheckIn = () => {
    if (!memberId) return;
    setCheckingIn(true);
    setTimeout(() => {
      setCheckingIn(false);
      setMemberId('');
      Alert.alert('Access Granted', 'Check-in registered successfully. Have a great workout!');
    }, 1000);
  };

  const handleExitKiosk = () => {
    Alert.alert('Exit Kiosk Mode', 'Lock terminal and return to Owner Command Center?', [
      { text: 'Cancel' },
      { text: 'Exit', onPress: () => router.replace('/dashboard/owner') }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0b0b0e' }]}>
      <View style={styles.kioskContent}>
        {/* Top Control Bar */}
        <Pressable onPress={handleExitKiosk} style={styles.exitButton}>
          <Lock size={16} color="#ef4444" />
          <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 13 }}>Exit Kiosk Mode</Text>
        </Pressable>

        {/* Center Panel */}
        <View style={styles.centerContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <ScanQrCode size={36} color="#000" />
          </View>
          <Text style={styles.welcomeText}>FitPulse Entry Pass</Text>
          <Text style={styles.subText}>Please type your member email or tap your phone pass to scan check-in.</Text>

          <Card style={[styles.formCard, { backgroundColor: '#15151a', borderColor: '#292933' }]}>
            <Input
              placeholder="alex@example.com"
              value={memberId}
              onChangeText={setMemberId}
              inputStyle={{ color: '#ffffff', backgroundColor: '#0b0b0e', borderColor: '#292933' }}
            />
            <Button
              title={checkingIn ? 'Authorizing Gate...' : 'Grant Gym Entry'}
              loading={checkingIn}
              onPress={handleCheckIn}
              disabled={!memberId}
              style={{ marginTop: 16 }}
            />
          </Card>
        </View>

        {/* Terminal Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SECURE TERMINAL GATE 1  •  fitpulse os v1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kioskContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ef444430',
    borderRadius: 99,
  },
  centerContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#8a8a99',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 32,
  },
  formCard: {
    width: '100%',
    padding: 24,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#8a8a99',
    letterSpacing: 1,
  },
});
