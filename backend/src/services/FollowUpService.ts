import FollowUp from '../models/FollowUp';
import Task from '../models/Task';
import FollowUpRepository from '../repositories/FollowUpRepository';
import TaskRepository from '../repositories/TaskRepository';
import { IFollowUpService } from '../interfaces/IFollowUpService';
import { FollowUpLevel } from '../types';
import { daysOverdue } from '../utils/dateUtils';
import config from '../config/config';
import FollowUpFactory from '../factories/FollowUpFactory';

class FollowUpService implements IFollowUpService {
  private readonly followUpRepo: FollowUpRepository;
  private readonly taskRepo: TaskRepository;

  constructor() {
    this.followUpRepo = new FollowUpRepository();
    this.taskRepo = new TaskRepository();
  }

  handleOverdueTask(task: Task): FollowUp | null {
    const existing = this.followUpRepo.findByTaskId(task.id!);
    if (existing) return null; // escalation handled separately

    const data = FollowUpFactory.create(task, 1);
    const row = this.followUpRepo.create(data);
    return new FollowUp(row);
  }

  escalatePendingFollowUps(): void {
    const pending = this.followUpRepo.findUnresolvedForEscalation();

    for (const row of pending) {
      const followUp = new FollowUp(row);
      const days = daysOverdue(row.due_date!);

      let targetLevel: FollowUpLevel = 1;
      if (days >= config.followUp.level3AfterDays) targetLevel = 3;
      else if (days >= config.followUp.level2AfterDays) targetLevel = 2;

      if (targetLevel > followUp.level) {
        this.followUpRepo.update(row.id as number, {
          level: targetLevel,
          message: FollowUpFactory.getMessage(targetLevel, row.task_title ?? 'your task'),
        });
      }
    }
  }

  getUserFollowUps(userId: number): FollowUp[] {
    return this.followUpRepo.findByUserId(userId).map(r => new FollowUp(r));
  }

  getAllFollowUps(): unknown[] {
    return this.followUpRepo.findAll();
  }

  resolveFollowUp(id: number, userId: number, isAdmin = false): boolean {
    const row = this.followUpRepo.findById(id);
    if (!row) throw new Error('FollowUp not found');
    if (!isAdmin && row.user_id !== userId) throw new Error('Not authorized');

    const followUp = new FollowUp(row);
    followUp.resolve(); // sets status + resolved_at atomically via model

    this.followUpRepo.update(id, {
      status: followUp.status,
      resolved_at: followUp.resolved_at ?? undefined,
    });
    this.taskRepo.update(row.task_id as number, { status: 'completed' });
    return true;
  }
}

export default FollowUpService;
