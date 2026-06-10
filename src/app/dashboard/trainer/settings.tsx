import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Coins, Shield, Moon, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useAITokens } from '@/context/AITokenContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrainerSettingsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const { user, logout, updateUser } = useAuth();
  const { tokens, buyTokens } = useAITokens();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  const handleSave = () => {
    updateUser({ name, phone });
    Alert.alert('Profile Saved', 'Trainer profile details updated.');
  };

  const handleBuyTokens = async (amount: number, price: string) => {
    await buyTokens(amount, `Purchased ${amount} tokens via Google Pay`);
    Alert.alert('Topup Success', `Successfully purchased ${amount} AI tokens for ${price}.`);
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Coach Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your trainer profile and billing.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>EDIT PROFILE</Text>
          <Card style={{ marginVertical: 0 }}>
            <Input label="Name" value={name} onChangeText={setName} />
            <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Button title="Save Changes" onPress={handleSave} style={{ marginTop: 16 }} />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI TOKENS BILLING</Text>
          <Card style={{ marginVertical: 0 }}>
            <View style={styles.tokenBalanceRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Coins size={22} color={colors.primary} />
                <Text style={[styles.tokenTitle, { color: colors.text }]}>AI Assistant Tokens</Text>
              </View>
              <Text style={[styles.tokenBalance, { color: colors.primary }]}>{tokens}</Text>
            </View>
            <View style={styles.topupGrid}>
              <Pressable
                onPress={() => handleBuyTokens(100, '₹99')}
                style={[styles.topupCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <Text style={[styles.topupQty, { color: colors.text }]}>100</Text>
                <Text style={[styles.topupPrice, { color: colors.primary }]}>₹99</Text>
              </Pressable>

              <Pressable
                onPress={() => handleBuyTokens(300, '₹249')}
                style={[styles.topupCard, { backgroundColor: colors.background, borderColor: colors.primary }]}
              >
                <Text style={[styles.topupQty, { color: colors.text }]}>300</Text>
                <Text style={[styles.topupPrice, { color: colors.primary }]}>₹249</Text>
              </Pressable>
            </View>
          </Card>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>
          <Card style={{ marginVertical: 0, gap: 16 }}>
            <View style={styles.prefRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Moon size={20} color={colors.textSecondary} />
                <Text style={[styles.prefText, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Text style={{ color: colors.textSecondary }}>System Controlled</Text>
            </View>
            <View style={styles.prefRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Bell size={20} color={colors.textSecondary} />
                <Text style={[styles.prefText, { color: colors.text }]}>Notifications</Text>
              </View>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Enabled</Text>
            </View>
          </Card>
        </View>

        <View style={{ marginTop: 32, marginBottom: 20 }}>
          <Button
            title="Log Out"
            variant="destructive"
            onPress={handleLogout}
          >
            <LogOut size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Log Out</Text>
          </Button>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  tokenBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenBalance: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  topupGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  topupCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  topupQty: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  topupPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prefText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
