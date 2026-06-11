import { Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';



export default function RootIndex() {
  const { user, isLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#cda34f" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/landing" />;
  } else if (!user.onboarded) {
    return <Redirect href="/onboarding" />;
  } else {
    const routeRole = (user.role === 'super_admin' ? 'owner' : user.role) as 'member' | 'owner' | 'trainer';
    return <Redirect href={`/dashboard/${routeRole}`} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0b0e',
  },
});
