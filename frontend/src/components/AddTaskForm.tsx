import { useState, FormEvent, ChangeEvent } from 'react';
import { apiService } from '../services/api';
import { TaskPriority, CreateTaskPayload } from '../types';

interface AddTaskFormProps {
  onAdded: () => void;
}

interface FormState {
  title: string;
  description: string;
  due_date: string;
  priority: TaskPriority;
}

export default function AddTaskForm({ onAdded }: AddTaskFormProps) {
  const [form, setForm] = useState<FormState>({ title: '', description: '', due_date: '', priority: 'medium' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload: CreateTaskPayload = { ...form };
      await apiService.createTask(payload);
      setForm({ title: '', description: '', due_date: '', priority: 'medium' });
      onAdded();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>Add Task</h3>
      {error && <p style={styles.error}>{error}</p>}
      <input name="title" placeholder="Task title" value={form.title} onChange={handleChange} required style={styles.input} />
      <input name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} style={styles.input} />
      <input name="due_date" type="datetime-local" value={form.due_date} onChange={handleChange} required style={styles.input} />
      <select name="priority" value={form.priority} onChange={handleChange} style={styles.input}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" disabled={loading} style={styles.btn}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 24 },
  heading: { margin: '0 0 12px', color: '#1e293b' },
  input: { display: 'block', width: '100%', padding: '8px 12px', marginBottom: 10, border: '1px solid #cbd5e1', borderRadius: 4, boxSizing: 'border-box' },
  btn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 4, cursor: 'pointer' },
  error: { color: '#ef4444', marginBottom: 8 },
};
