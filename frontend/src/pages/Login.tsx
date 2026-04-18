import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register';

interface FormState {
  name: string;
  email: string;
  password: string;
}

export default function Login() {
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function toggleMode(): void {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError('');
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>TaskFlow</h2>
        <p style={styles.sub}>{mode === 'login' ? 'Sign in to your account' : 'Create an account'}</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required style={styles.input} />
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={styles.input} />
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
        <p style={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.link} onClick={toggleMode}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
  card: { background: '#fff', padding: 32, borderRadius: 12, width: 360, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { margin: '0 0 4px', color: '#1e293b', textAlign: 'center' },
  sub: { color: '#64748b', textAlign: 'center', marginBottom: 20 },
  input: { display: 'block', width: '100%', padding: '10px 12px', marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6, boxSizing: 'border-box', fontSize: 14 },
  btn: { width: '100%', padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 },
  error: { color: '#ef4444', marginBottom: 12, fontSize: 14 },
  toggle: { textAlign: 'center', marginTop: 16, color: '#64748b', fontSize: 14 },
  link: { color: '#3b82f6', cursor: 'pointer' },
};
