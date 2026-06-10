import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { AITokenProvider } from '@/context/AITokenContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AITokenProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="kiosk" />
          <Stack.Screen name="dashboard" />
        </Stack>
      </AITokenProvider>
    </AuthProvider>
  );
}
