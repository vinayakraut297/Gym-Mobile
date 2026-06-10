import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerNotificationsScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('All Members');

  const handleBroadcast = () => {
    if (!message) return;
    Alert.alert('Broadcast Sent', `Sent SMS/WhatsApp broadcast to "${target}": "${message}"`, [
      { text: 'OK', onPress: () => { setMessage(''); router.back(); } }
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
          <Text style={[styles.title, { color: colors.text }]}>Broadcaster</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Send mass messages to your cohort.</Text>
        </View>

        <Card style={{ marginVertical: 0 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <MessageSquare size={18} color={colors.primary} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>Compose SMS / WhatsApp</Text>
          </View>

          <Input
            label="Recipient Cohort"
            value={target}
            onChangeText={setTarget}
          />

          <Input
            label="Message Body"
            placeholder="Type your broadcast message..."
            value={message}
            onChangeText={setMessage}
            style={{ height: 100 }}
          />

          <Button
            title="Broadcast Message"
            onPress={handleBroadcast}
            disabled={!message}
            style={{ marginTop: 24 }}
          >
            <Send size={16} color={scheme === 'dark' ? '#000000' : '#ffffff'} style={{ marginRight: 8 }} />
            <Text style={{ color: scheme === 'dark' ? '#000000' : '#ffffff', fontWeight: 'bold' }}>Broadcast</Text>
          </Button>
        </Card>
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
});
