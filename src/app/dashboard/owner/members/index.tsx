import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Search, UserPlus, Phone } from 'lucide-react-native';
import { fetchWithAuth } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerMembersScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/members')
      .then((data) => {
        setMembers(data.members || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Gym Members</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Add, edit, and audit member records.</Text>
        </View>

        {/* Search & Add row */}
        <View style={styles.searchRow}>
          <Input
            placeholder="Search member..."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginVertical: 0 }}
          />
          <Button
            onPress={() => router.push('/dashboard/owner/members/add')}
            style={styles.addBtn}
          >
            <UserPlus size={16} color={scheme === 'dark' ? '#000000' : '#ffffff'} />
          </Button>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <View style={{ gap: 14 }}>
            {filtered.map((member) => (
              <Card key={member.id} style={styles.memberCard}>
                <Pressable onPress={() => router.push(`/dashboard/owner/members/${member.id}`)}>
                  <View style={styles.memberHeader}>
                    <View style={styles.avatarRow}>
                      <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={[styles.avatarText, { color: colors.primary }]}>
                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                        <Text style={{ fontSize: 12, color: colors.textSecondary }}>Goal: {member.goal}</Text>
                      </View>
                    </View>
                    <Badge variant={member.status === 'active' ? 'success' : 'destructive'}>
                      <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                        {member.status.toUpperCase()}
                      </Text>
                    </Badge>
                  </View>

                  <View style={styles.contactRow}>
                    <Phone size={14} color={colors.textSecondary} />
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>{member.phone || 'N/A'}</Text>
                  </View>
                </Pressable>
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
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberCard: {
    marginVertical: 0,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc3',
  },
});
