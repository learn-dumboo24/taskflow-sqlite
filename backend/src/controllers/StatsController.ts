import { Request, Response, NextFunction } from 'express';
import StatsService from '../services/StatsService';

class StatsController {
  private readonly statsService: StatsService;

  constructor() {
    this.statsService = new StatsService();
    this.getAppStats = this.getAppStats.bind(this);
    this.getUserStats = this.getUserStats.bind(this);
  }

  getAppStats(req: Request, res: Response, next: NextFunction): void {
    try {
      const stats = this.statsService.getStats();
      res.json(stats);
    } catch (err) { next(err); }
  }

  getUserStats(req: Request, res: Response, next: NextFunction): void {
    try {
      const stats = this.statsService.getUserStats(req.user!.id);
      res.json(stats);
    } catch (err) { next(err); }
  }
}

export default StatsController;
