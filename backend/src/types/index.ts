export type UserRole = 'user' | 'admin';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type FollowUpLevel = 1 | 2 | 3;
export type FollowUpStatus = 'pending' | 'resolved';

export interface BaseModelData {
  id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserData extends BaseModelData {
  name?: string;
  email?: string;
  password_hash?: string;
  role?: UserRole;
  is_active?: number | boolean;
}

export interface TaskData extends BaseModelData {
  user_id?: number | null;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface FollowUpData extends BaseModelData {
  task_id?: number | null;
  user_id?: number | null;
  level?: FollowUpLevel;
  status?: FollowUpStatus;
  message?: string;
  resolved_at?: string | null;
  // joined fields from queries
  task_title?: string;
  due_date?: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  user: Record<string, unknown>;
  token: string;
}
