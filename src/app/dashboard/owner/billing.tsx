import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { IndianRupee, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerBillingScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/invoices')
      .then((data) => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCollect = (id: string, amount: number) => {
    Alert.alert('Collect Bill', `Mark invoice ${id} of amount ₹${amount} as PAID via UPI?`, [
      { text: 'Cancel' },
      {
        text: 'Confirm Collection',
        onPress: () => {
          setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'paid' } : inv));
          Alert.alert('Success', 'Collected payment.');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Billing Desk</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Collect pending dues and issue receipts.</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={{ gap: 14 }}>
            {invoices.map((inv) => (
              <Card key={inv.id} style={styles.invoiceCard}>
                <View style={styles.invoiceHeader}>
                  <View>
                    <Text style={[styles.clientTitle, { color: colors.text }]}>Member ID: {inv.userId}</Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>Due Date: {inv.dueDate}</Text>
                  </View>
                  <Badge variant={inv.status === 'paid' ? 'success' : 'destructive'}>
                    <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>{inv.status.toUpperCase()}</Text>
                  </Badge>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.priceRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IndianRupee size={16} color={colors.text} />
                    <Text style={[styles.priceValue, { color: colors.text }]}>{inv.amount}</Text>
                  </View>
                  {inv.status === 'overdue' && (
                    <Button
                      title="Collect UPI"
                      size="sm"
                      onPress={() => handleCollect(inv.id, inv.amount)}
                    />
                  )}
                </View>
              </Card>
            ))}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
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
  invoiceCard: {
    marginVertical: 0,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    height: 0.5,
    marginVertical: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
