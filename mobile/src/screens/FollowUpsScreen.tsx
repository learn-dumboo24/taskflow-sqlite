import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FollowUp } from '../types';
import { apiService } from '../services/ApiService';
import FollowUpCard from '../components/FollowUpCard';

export default function FollowUpsScreen() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const data = await apiService.getFollowUps();
      setFollowUps(data);
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const pending = followUps.filter(f => f.status === 'pending');
  const resolved = followUps.filter(f => f.status === 'resolved');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>FollowUps</Text>
        {pending.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pending.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={[...pending, ...resolved]}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} tintColor="#3b82f6" />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? 'Loading...' : '🎉 No followups — all tasks on track!'}
          </Text>
        }
        ListHeaderComponent={
          pending.length > 0 ? (
            <Text style={styles.sectionLabel}>Pending ({pending.length})</Text>
          ) : null
        }
        renderItem={({ item, index }) => (
          <>
            {item.status === 'resolved' && index === pending.length && (
              <Text style={[styles.sectionLabel, { color: '#475569' }]}>
                Resolved ({resolved.length})
              </Text>
            )}
            <FollowUpCard followUp={item} onUpdate={load} />
          </>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { color: '#f1f5f9', fontSize: 22, fontWeight: '700' },
  badge: { backgroundColor: '#ef4444', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionLabel: { color: '#ef4444', fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  empty: { color: '#475569', textAlign: 'center', marginTop: 60, fontSize: 15 },
});
