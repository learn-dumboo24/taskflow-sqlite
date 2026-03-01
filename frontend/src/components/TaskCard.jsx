import { tasksAPI } from '../services/api';

const STATUS_COLORS = { pending: '#f59e0b', in_progress: '#3b82f6', completed: '#22c55e' };
const PRIORITY_COLORS = { low: '#94a3b8', medium: '#f59e0b', high: '#ef4444' };

export default function TaskCard({ task, onUpdate }) {
  async function handleStatusChange(e) {
    try {
      await tasksAPI.update(task.id, { status: e.target.value });
      onUpdate();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this task?')) return;
    try {
      await tasksAPI.delete(task.id);
      onUpdate();
    } catch (err) {
      alert(err.message);
    }
  }

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${PRIORITY_COLORS[task.priority]}`, opacity: task.status === 'completed' ? 0.6 : 1 }}>
      <div style={styles.top}>
        <span style={styles.title}>{task.title}</span>
        <span style={{ ...styles.badge, background: STATUS_COLORS[task.status] }}>{task.status}</span>
      </div>
      {task.description && <p style={styles.desc}>{task.description}</p>}
      <div style={styles.meta}>
        <span style={{ color: isOverdue ? '#ef4444' : '#64748b' }}>
          Due: {new Date(task.due_date).toLocaleString()}
          {isOverdue && ' ⚠️ OVERDUE'}
        </span>
        <span style={{ color: PRIORITY_COLORS[task.priority] }}>{task.priority}</span>
      </div>
      <div style={styles.actions}>
        <select value={task.status} onChange={handleStatusChange} style={styles.select}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handleDelete} style={styles.deleteBtn}>Delete</button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 12 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontWeight: 600, color: '#1e293b' },
  badge: { color: '#fff', padding: '2px 8px', borderRadius: 12, fontSize: 12 },
  desc: { color: '#64748b', fontSize: 14, margin: '4px 0 8px' },
  meta: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 },
  actions: { display: 'flex', gap: 8 },
  select: { padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1' },
  deleteBtn: { background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' },
};
