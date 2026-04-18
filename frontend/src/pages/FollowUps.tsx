import { useState, useEffect } from 'react';
import { FollowUp, FollowUpLevel } from '../types';
import { apiService } from '../services/api';

const LEVEL_COLORS: Record<FollowUpLevel, string> = { 1: '#f59e0b', 2: '#f97316', 3: '#ef4444' };
const LEVEL_LABELS: Record<FollowUpLevel, string> = { 1: 'Reminder', 2: 'Urgent', 3: 'Critical' };

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFollowUps(): Promise<void> {
    try {
      const data = await apiService.getFollowUps();
      setFollowUps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadFollowUps(); }, []);

  async function handleResolve(id: number): Promise<void> {
    try {
      await apiService.resolveFollowUp(id);
      void loadFollowUps();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  const pending = followUps.filter(f => f.status === 'pending');
  const resolved = followUps.filter(f => f.status === 'resolved');

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>FollowUps</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {pending.length === 0 ? (
            <p style={styles.empty}>No pending followups 🎉</p>
          ) : (
            <>
              <h3 style={styles.section}>Pending ({pending.length})</h3>
              {pending.map(f => (
                <div key={f.id} style={{ ...styles.card, borderLeft: `4px solid ${LEVEL_COLORS[f.level]}` }}>
                  <div style={styles.top}>
                    <span style={styles.taskTitle}>{f.task_title}</span>
                    <span style={{ ...styles.levelBadge, background: LEVEL_COLORS[f.level] }}>
                      Level {f.level} — {LEVEL_LABELS[f.level]}
                    </span>
                  </div>
                  <p style={styles.message}>{f.message}</p>
                  {f.due_date && <p style={styles.meta}>Due: {new Date(f.due_date).toLocaleDateString()}</p>}
                  <button onClick={() => void handleResolve(f.id)} style={styles.resolveBtn}>
                    Mark Resolved
                  </button>
                </div>
              ))}
            </>
          )}
          {resolved.length > 0 && (
            <>
              <h3 style={{ ...styles.section, color: '#94a3b8' }}>Resolved ({resolved.length})</h3>
              {resolved.map(f => (
                <div key={f.id} style={{ ...styles.card, opacity: 0.5 }}>
                  <span style={styles.taskTitle}>{f.task_title}</span>
                  <span style={{ color: '#22c55e', marginLeft: 8 }}>✓ Resolved</span>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 720, margin: '0 auto', padding: 24 },
  title: { margin: '0 0 20px', color: '#1e293b' },
  section: { color: '#ef4444', marginBottom: 12 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 12 },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  taskTitle: { fontWeight: 600, color: '#1e293b' },
  levelBadge: { color: '#fff', padding: '2px 10px', borderRadius: 12, fontSize: 12 },
  message: { color: '#64748b', fontSize: 14, margin: '0 0 8px' },
  meta: { fontSize: 13, color: '#94a3b8', marginBottom: 10 },
  resolveBtn: { background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 14px', borderRadius: 4, cursor: 'pointer' },
  empty: { color: '#22c55e', textAlign: 'center', padding: 40, fontSize: 16 },
};
