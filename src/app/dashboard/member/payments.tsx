import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, IndianRupee, ShieldCheck } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    Alert.alert('Payment Successful', '₹1,500 successfully collected via UPI mock transfer.', [
      { text: 'OK', onPress: () => setPaid(true) }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.textSecondary} />
          <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Gym Dues & Billing</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Settle membership fees securely.</Text>
        </View>

        {paid ? (
          <Card style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ShieldCheck size={48} color="#22c55e" />
            <Text style={[styles.successTitle, { color: colors.text }]}>No Outstanding Dues</Text>
            <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
              Thank you! Your FitPulse Elite Basic plan is active until June 15, 2026.
            </Text>
          </Card>
        ) : (
          <Card style={styles.invoiceCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={[styles.invoiceTitle, { color: colors.text }]}>FitPulse Elite Basic</Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Invoice due May 10, 2026</Text>
              </View>
              <Badge variant="destructive">OVERDUE</Badge>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Total Amount</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>₹1,500</Text>
            </View>

            <Button
              title="Pay now via UPI"
              onPress={handlePay}
              style={{ marginTop: 24, height: 50 }}
            />
          </Card>
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
    paddingHorizontal: 20,
    paddingTop: 12,
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  invoiceCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 0.5,
    marginVertical: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  successDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    paddingHorizontal: 20,
  },
});
