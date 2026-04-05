const FollowUp = require('../models/FollowUp');
const FollowUpRepository = require('../repositories/FollowUpRepository');
const TaskRepository = require('../repositories/TaskRepository');
const { daysOverdue: calcDaysOverdue } = require('../utils/dateUtils');
const config = require('../config/config');

const LEVEL_MESSAGES = {
  1: (title) => `Reminder: "${title}" is overdue. Please complete it soon.`,
  2: (title) => `Urgent: "${title}" is significantly overdue. Address this immediately.`,
  3: (title) => `Critical: "${title}" has been overdue for too long. Immediate action required.`,
};

// FollowUpFactory — centralizes followup creation logic
class FollowUpFactory {
  static create(task, level) {
    return {
      task_id: task.id,
      user_id: task.user_id,
      level,
      status: 'pending',
      message: LEVEL_MESSAGES[level](task.title),
    };
  }
}

class FollowUpService {
  constructor() {
    this.followUpRepo = new FollowUpRepository();
    this.taskRepo = new TaskRepository();
  }

  handleOverdueTask(task) {
    const existing = this.followUpRepo.findByTaskId(task.id);

    if (!existing) {
      const data = FollowUpFactory.create(task, 1);
      const row = this.followUpRepo.create(data);
      return new FollowUp(row);
    }

    return null; // already has a followup, escalation handled separately
  }

  escalatePendingFollowUps() {
    const pending = this.followUpRepo.findUnresolvedForEscalation();

    for (const row of pending) {
      const followUp = new FollowUp(row);
      const daysOverdue = calcDaysOverdue(row.due_date);

      let targetLevel = 1;
      if (daysOverdue >= config.followUp.level3AfterDays) targetLevel = 3;
      else if (daysOverdue >= config.followUp.level2AfterDays) targetLevel = 2;

      if (targetLevel > followUp.level) {
        this.followUpRepo.update(row.id, {
          level: targetLevel,
          message: LEVEL_MESSAGES[targetLevel](row.task_title || 'your task'),
        });
      }
    }
  }

  getUserFollowUps(userId) {
    return this.followUpRepo.findByUserId(userId).map(r => new FollowUp(r));
  }

  getAllFollowUps() {
    return this.followUpRepo.findAll();
  }

  resolveFollowUp(id, userId, isAdmin = false) {
    const row = this.followUpRepo.findById(id);
    if (!row) throw new Error('FollowUp not found');
    if (!isAdmin && row.user_id !== userId) throw new Error('Not authorized');
    if (row.status === 'resolved') throw new Error('Already resolved');

    const followUp = new FollowUp(row);
    followUp.resolve();

    this.followUpRepo.update(id, {
      status: followUp.status,
      resolved_at: followUp.resolved_at,
    });

    this.taskRepo.update(row.task_id, { status: 'completed' });

    return true;
  }
}

module.exports = FollowUpService;
