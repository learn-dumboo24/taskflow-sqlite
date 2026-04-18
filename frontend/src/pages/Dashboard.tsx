import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { apiService } from '../services/api';
import AddTaskForm from '../components/AddTaskForm';
import TaskCard from '../components/TaskCard';

type Filter = 'all' | TaskStatus;

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  async function loadTasks(): Promise<void> {
    try {
      const data = await apiService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadTasks(); }, []);

  const filtered: Task[] = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const overdueCount = tasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completed').length;
  const filters: Filter[] = ['all', 'pending', 'in_progress', 'completed'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Tasks</h2>
        {overdueCount > 0 && (
          <span style={styles.overdueAlert}>⚠️ {overdueCount} overdue</span>
        )}
      </div>
      <AddTaskForm onAdded={loadTasks} />
      <div style={styles.filters}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, background: filter === f ? '#3b82f6' : '#e2e8f0', color: filter === f ? '#fff' : '#1e293b' }}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.empty}>No tasks found</p>
      ) : (
        filtered.map(task => <TaskCard key={task.id} task={task} onUpdate={loadTasks} />)
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 720, margin: '0 auto', padding: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { margin: 0, color: '#1e293b' },
  overdueAlert: { background: '#fee2e2', color: '#ef4444', padding: '4px 12px', borderRadius: 12, fontSize: 13 },
  filters: { display: 'flex', gap: 8, marginBottom: 16 },
  filterBtn: { border: 'none', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13 },
  empty: { color: '#94a3b8', textAlign: 'center', padding: 40 },
};
