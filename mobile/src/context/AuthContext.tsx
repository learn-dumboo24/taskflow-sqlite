import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/ApiService';
import { storageService } from '../services/StorageService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const stored = await storageService.getObject<User>('user');
      if (stored) setUser(stored);
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const result = await apiService.login(email, password);
    await storageService.set('token', result.token);
    await storageService.setObject('user', result.user);
    setUser(result.user);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    const result = await apiService.register(name, email, password);
    await storageService.set('token', result.token);
    await storageService.setObject('user', result.user);
    setUser(result.user);
  }

  async function logout(): Promise<void> {
    await storageService.remove('token');
    await storageService.remove('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
