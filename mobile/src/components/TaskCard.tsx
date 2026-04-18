import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Task, TaskStatus, TaskPriority } from '../types';
import { apiService } from '../services/ApiService';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  completed: '#22c55e',
};

const NEXT_STATUS: Partial<Record<TaskStatus, TaskStatus>> = {
  pending: 'in_progress',
  in_progress: 'completed',
};

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';
  const nextStatus = NEXT_STATUS[task.status];

  async function handleAdvance(): Promise<void> {
    if (!nextStatus) return;
    try {
      await apiService.updateTask(task.id, { status: nextStatus });
      onUpdate();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  }

  function handleDelete(): void {
    Alert.alert('Delete Task', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await apiService.deleteTask(task.id);
            onUpdate();
          } catch (err) {
            Alert.alert('Error', (err as Error).message);
          }
        },
      },
    ]);
  }

  return (
    <View style={[styles.card, { borderLeftColor: PRIORITY_COLORS[task.priority] }, isOverdue && styles.cardOverdue]}>
      <View style={styles.header}>
        <Text style={[styles.title, task.status === 'completed' && styles.titleDone]} numberOfLines={1}>
          {task.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[task.status] }]}>
          <Text style={styles.statusText}>{task.status.replace('_', ' ')}</Text>
        </View>
      </View>

      {task.description ? <Text style={styles.desc} numberOfLines={2}>{task.description}</Text> : null}

      <View style={styles.meta}>
        <Text style={[styles.dueDate, isOverdue && styles.dueDateOverdue]}>
          {isOverdue ? '⚠ ' : ''}Due: {new Date(task.due_date).toLocaleDateString('en-IN')}
        </Text>
        <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[task.priority] + '22' }]}>
          <Text style={[styles.priorityText, { color: PRIORITY_COLORS[task.priority] }]}>{task.priority}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {nextStatus && (
          <TouchableOpacity style={styles.advanceBtn} onPress={handleAdvance}>
            <Text style={styles.advanceBtnText}>
              Mark {nextStatus.replace('_', ' ')} →
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
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
  cardOverdue: { backgroundColor: '#1c1917', borderColor: '#ef4444' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { flex: 1, color: '#f1f5f9', fontWeight: '600', fontSize: 15, marginRight: 8 },
  titleDone: { textDecorationLine: 'line-through', color: '#64748b' },
  statusBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  desc: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dueDate: { color: '#64748b', fontSize: 12 },
  dueDateOverdue: { color: '#ef4444' },
  priorityBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  priorityText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  advanceBtn: { flex: 1, backgroundColor: '#0f172a', borderRadius: 6, paddingVertical: 6, alignItems: 'center' },
  advanceBtnText: { color: '#3b82f6', fontSize: 13, fontWeight: '600' },
  deleteBtn: { padding: 6 },
  deleteBtnText: { color: '#475569', fontSize: 16 },
});
