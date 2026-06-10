import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="member" />
      <Stack.Screen name="owner" />
      <Stack.Screen name="trainer" />
    </Stack>
  );
}
