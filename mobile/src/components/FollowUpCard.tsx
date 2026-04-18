import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FollowUp, FollowUpLevel } from '../types';
import { apiService } from '../services/ApiService';

interface FollowUpCardProps {
  followUp: FollowUp;
  onUpdate: () => void;
}

const LEVEL_COLORS: Record<FollowUpLevel, string> = {
  1: '#f59e0b',
  2: '#f97316',
  3: '#ef4444',
};

const LEVEL_LABELS: Record<FollowUpLevel, string> = {
  1: 'Reminder',
  2: 'Urgent',
  3: 'Critical',
};

export default function FollowUpCard({ followUp, onUpdate }: FollowUpCardProps) {
  const color = LEVEL_COLORS[followUp.level];
  const label = LEVEL_LABELS[followUp.level];

  async function handleResolve(): Promise<void> {
    Alert.alert('Resolve FollowUp', 'This will mark the task as completed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Resolve',
        onPress: async () => {
          try {
            await apiService.resolveFollowUp(followUp.id);
            onUpdate();
          } catch (err) {
            Alert.alert('Error', (err as Error).message);
          }
        },
      },
    ]);
  }

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.taskTitle} numberOfLines={1}>{followUp.task_title ?? `Task #${followUp.task_id}`}</Text>
        <View style={[styles.levelBadge, { backgroundColor: color }]}>
          <Text style={styles.levelText}>Level {followUp.level} · {label}</Text>
        </View>
      </View>
      <Text style={styles.message}>{followUp.message}</Text>
      {followUp.due_date && (
        <Text style={styles.due}>Due: {new Date(followUp.due_date).toLocaleDateString('en-IN')}</Text>
      )}
      {followUp.status === 'pending' && (
        <TouchableOpacity style={styles.resolveBtn} onPress={handleResolve}>
          <Text style={styles.resolveBtnText}>✓ Mark Resolved</Text>
        </TouchableOpacity>
      )}
      {followUp.status === 'resolved' && (
        <Text style={styles.resolvedTag}>✓ Resolved</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskTitle: { flex: 1, color: '#f1f5f9', fontWeight: '600', fontSize: 15, marginRight: 8 },
  levelBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  message: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  due: { color: '#64748b', fontSize: 12, marginBottom: 10 },
  resolveBtn: { backgroundColor: '#14532d', borderRadius: 6, paddingVertical: 8, alignItems: 'center' },
  resolveBtnText: { color: '#22c55e', fontSize: 13, fontWeight: '600' },
  resolvedTag: { color: '#22c55e', fontSize: 13 },
});
