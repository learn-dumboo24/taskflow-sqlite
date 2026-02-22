const cron = require('node-cron');
const TaskService = require('../services/TaskService');
const FollowUpService = require('../services/FollowUpService');
const config = require('../config/config');

class FollowUpScheduler {
  constructor() {
    this.taskService = new TaskService();
    this.followUpService = new FollowUpService();
  }

  start() {
    cron.schedule(config.followUp.schedulerCron, () => {
      this.runCheck();
    });
    console.log('FollowUp scheduler started');
  }

  runCheck() {
    console.log('[Scheduler] Checking overdue tasks...');
    try {
      const overdueTasks = this.taskService.getOverdueTasks();

      for (const task of overdueTasks) {
        this.followUpService.handleOverdueTask(task);
      }

      this.followUpService.escalatePendingFollowUps();

      console.log(`[Scheduler] Processed ${overdueTasks.length} overdue tasks`);
    } catch (err) {
      console.error('[Scheduler] Error:', err.message);
    }
  }
}

module.exports = FollowUpScheduler;
