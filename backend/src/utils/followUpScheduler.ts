import cron from 'node-cron';
import TaskService from '../services/TaskService';
import FollowUpService from '../services/FollowUpService';
import config from '../config/config';

class FollowUpScheduler {
  private readonly taskService: TaskService;
  private readonly followUpService: FollowUpService;

  constructor() {
    this.taskService = new TaskService();
    this.followUpService = new FollowUpService();
  }

  start(): void {
    cron.schedule(config.followUp.schedulerCron, () => {
      this.runCheck();
    });
    console.log('FollowUp scheduler started');
  }

  runCheck(): void {
    console.log('[Scheduler] Checking overdue tasks...');
    try {
      const overdueTasks = this.taskService.getOverdueTasks();
      for (const task of overdueTasks) {
        this.followUpService.handleOverdueTask(task);
      }
      this.followUpService.escalatePendingFollowUps();
      console.log(`[Scheduler] Processed ${overdueTasks.length} overdue tasks`);
    } catch (err) {
      console.error('[Scheduler] Error:', (err as Error).message);
    }
  }
}

export default FollowUpScheduler;
