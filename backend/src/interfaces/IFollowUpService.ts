import FollowUp from '../models/FollowUp';
import Task from '../models/Task';

export interface IFollowUpService {
  handleOverdueTask(task: Task): FollowUp | null;
  escalatePendingFollowUps(): void;
  getUserFollowUps(userId: number): FollowUp[];
  getAllFollowUps(): unknown[];
  resolveFollowUp(id: number, userId: number, isAdmin?: boolean): boolean;
}
