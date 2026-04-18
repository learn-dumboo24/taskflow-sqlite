import {
  AuthResult,
  Task,
  FollowUp,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '../types';

// ApiService class — encapsulates all HTTP logic, single responsibility
class ApiService {
  private readonly baseUrl = '/api';

  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: this.getHeaders(),
    });
    const data = await res.json() as T & { error?: string };
    if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Request failed');
    return data;
  }

  // Auth
  register(name: string, email: string, password: string): Promise<AuthResult> {
    return this.request<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  login(email: string, password: string): Promise<AuthResult> {
    return this.request<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Tasks
  getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  createTask(payload: CreateTaskPayload): Promise<Task> {
    return this.request<Task>('/tasks', { method: 'POST', body: JSON.stringify(payload) });
  }

  updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  }

  deleteTask(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' });
  }

  // FollowUps
  getFollowUps(): Promise<FollowUp[]> {
    return this.request<FollowUp[]>('/followups');
  }

  resolveFollowUp(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/followups/${id}/resolve`, { method: 'PATCH' });
  }
}

// Singleton — one instance shared across the app
export const apiService = new ApiService();
