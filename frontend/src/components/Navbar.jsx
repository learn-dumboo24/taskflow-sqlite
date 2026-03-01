import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>TaskFlow</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Tasks</Link>
        <Link to="/followups" style={styles.link}>FollowUps</Link>
        <span style={styles.user}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.btn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1a2332', color: '#fff' },
  brand: { color: '#4ade80', textDecoration: 'none', fontWeight: 'bold', fontSize: 18 },
  links: { display: 'flex', alignItems: 'center', gap: 16 },
  link: { color: '#cbd5e1', textDecoration: 'none' },
  user: { color: '#94a3b8', fontSize: 14 },
  btn: { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' },
};
