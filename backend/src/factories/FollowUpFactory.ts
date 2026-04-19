import Task from '../models/Task';
import { FollowUpData, FollowUpLevel } from '../types';

const MESSAGES: Record<FollowUpLevel, (title: string) => string> = {
  1: (t) => `Reminder: "${t}" is overdue. Please complete it soon.`,
  2: (t) => `Urgent: "${t}" is significantly overdue. Address this immediately.`,
  3: (t) => `Critical: "${t}" has been overdue for too long. Immediate action required.`,
};

class FollowUpFactory {
  static create(task: Task, level: FollowUpLevel): Partial<FollowUpData> {
    return {
      task_id: task.id!,
      user_id: task.user_id!,
      level,
      status: 'pending',
      message: this.getMessage(level, task.title),
    };
  }

  static getMessage(level: FollowUpLevel, taskTitle: string): string {
    return MESSAGES[level](taskTitle);
  }
}

export default FollowUpFactory;
