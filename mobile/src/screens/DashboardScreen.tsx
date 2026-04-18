import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Modal, ScrollView,
  TouchableOpacity, StyleSheet, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Task, TaskStatus, CreateTaskPayload, TaskPriority } from '../types';
import { apiService } from '../services/ApiService';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import Input from '../components/Input';
import Button from '../components/Button';

type Filter = 'all' | TaskStatus;

interface AddFormState {
  title: string;
  description: string;
  due_date: string;
  priority: TaskPriority;
}

const FILTERS: Filter[] = ['all', 'pending', 'in_progress', 'completed'];

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddFormState>({ title: '', description: '', due_date: '', priority: 'medium' });
  const [addLoading, setAddLoading] = useState(false);

  const loadTasks = useCallback(async (): Promise<void> => {
    try {
      const data = await apiService.getTasks();
      setTasks(data);
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  async function handleAdd(): Promise<void> {
    if (!addForm.title.trim() || !addForm.due_date.trim()) {
      Alert.alert('Validation', 'Title and due date are required');
      return;
    }
    setAddLoading(true);
    try {
      const payload: CreateTaskPayload = { ...addForm };
      await apiService.createTask(payload);
      setShowAddModal(false);
      setAddForm({ title: '', description: '', due_date: '', priority: 'medium' });
      void loadTasks();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setAddLoading(false);
    }
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const overdueCount = tasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completed').length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          {overdueCount > 0 && (
            <Text style={styles.overdueText}>⚠ {overdueCount} task{overdueCount > 1 ? 's' : ''} overdue</Text>
          )}
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task List */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void loadTasks(); }} tintColor="#3b82f6" />}
        ListEmptyComponent={
          <Text style={styles.empty}>{loading ? 'Loading...' : 'No tasks found'}</Text>
        }
        renderItem={({ item }) => <TaskCard task={item} onUpdate={loadTasks} />}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Input label="Title" placeholder="Task title" value={addForm.title} onChangeText={v => setAddForm(p => ({ ...p, title: v }))} />
            <Input label="Description" placeholder="Optional" value={addForm.description} onChangeText={v => setAddForm(p => ({ ...p, description: v }))} multiline />
            <Input label="Due Date (YYYY-MM-DD HH:MM)" placeholder="2026-05-01 18:00" value={addForm.due_date} onChangeText={v => setAddForm(p => ({ ...p, due_date: v }))} />
            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.priorityBtn, addForm.priority === p && styles.priorityBtnActive]}
                  onPress={() => setAddForm(prev => ({ ...prev, priority: p }))}
                >
                  <Text style={[styles.priorityBtnText, addForm.priority === p && styles.priorityBtnTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Add Task" onPress={handleAdd} loading={addLoading} style={styles.addBtn} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  greeting: { color: '#f1f5f9', fontSize: 20, fontWeight: '700' },
  overdueText: { color: '#ef4444', fontSize: 12, marginTop: 2 },
  logoutBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  logoutText: { color: '#94a3b8', fontSize: 13 },
  filterRow: { maxHeight: 44, marginBottom: 8 },
  filterContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#1e293b' },
  filterChipActive: { backgroundColor: '#3b82f6' },
  filterText: { color: '#64748b', fontSize: 13 },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  empty: { color: '#475569', textAlign: 'center', marginTop: 60, fontSize: 15 },
  fab: { position: 'absolute', bottom: 28, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  modal: { flex: 1, backgroundColor: '#0f172a' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  modalTitle: { color: '#f1f5f9', fontSize: 18, fontWeight: '700' },
  modalClose: { color: '#64748b', fontSize: 18 },
  modalBody: { padding: 20 },
  fieldLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  priorityRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  priorityBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#1e293b', alignItems: 'center' },
  priorityBtnActive: { backgroundColor: '#3b82f6' },
  priorityBtnText: { color: '#64748b', fontWeight: '600' },
  priorityBtnTextActive: { color: '#fff' },
  addBtn: { marginTop: 8 },
});
