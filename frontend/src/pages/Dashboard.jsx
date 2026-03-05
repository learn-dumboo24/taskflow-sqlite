import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import AddTaskForm from '../components/AddTaskForm';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  async function loadTasks() {
    try {
      const data = await tasksAPI.getAll();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const overdueCount = tasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completed').length;

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
        {['all', 'pending', 'in_progress', 'completed'].map(f => (
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

const styles = {
  container: { maxWidth: 720, margin: '0 auto', padding: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { margin: 0, color: '#1e293b' },
  overdueAlert: { background: '#fee2e2', color: '#ef4444', padding: '4px 12px', borderRadius: 12, fontSize: 13 },
  filters: { display: 'flex', gap: 8, marginBottom: 16 },
  filterBtn: { border: 'none', padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 13 },
  empty: { color: '#94a3b8', textAlign: 'center', padding: 40 },
};
