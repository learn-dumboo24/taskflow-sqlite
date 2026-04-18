export type UserRole = 'user' | 'admin';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type FollowUpLevel = 1 | 2 | 3;
export type FollowUpStatus = 'pending' | 'resolved';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  created_at: string;
  updated_at: string;
  // joined fields (admin view)
  user_name?: string;
  user_email?: string;
}

export interface FollowUp {
  id: number;
  task_id: number;
  user_id: number;
  level: FollowUpLevel;
  status: FollowUpStatus;
  message: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  // joined fields
  task_title?: string;
  due_date?: string;
  user_name?: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  due_date: string;
  priority: TaskPriority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}
