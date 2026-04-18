import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

type Mode = 'login' | 'register';

interface FormState {
  name: string;
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  function setField(field: keyof FormState, value: string): void {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(): Promise<void> {
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email.trim(), form.password);
      } else {
        await register(form.name.trim(), form.email.trim(), form.password);
      }
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function toggleMode(): void {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.logo}>TaskFlow</Text>
          <Text style={styles.subtitle}>
            {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
          </Text>

          {mode === 'register' && (
            <Input
              label="Full Name"
              placeholder="Sanket Jha"
              value={form.name}
              onChangeText={v => setField('name', v)}
              autoCapitalize="words"
            />
          )}
          <Input
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChangeText={v => setField('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChangeText={v => setField('password', v)}
            secureTextEntry
          />

          <Button
            title={mode === 'login' ? 'Sign In' : 'Register'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitBtn}
          />

          <TouchableOpacity onPress={toggleMode} style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.toggleLink}>
                {mode === 'login' ? 'Register' : 'Sign in'}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#4ade80', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#64748b', textAlign: 'center', marginBottom: 32, fontSize: 15 },
  submitBtn: { marginTop: 8, marginBottom: 16 },
  toggleRow: { alignItems: 'center' },
  toggleText: { color: '#64748b', fontSize: 14 },
  toggleLink: { color: '#3b82f6', fontWeight: '600' },
});
