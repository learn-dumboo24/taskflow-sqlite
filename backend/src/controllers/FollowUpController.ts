import { Request, Response, NextFunction } from 'express';
import FollowUpService from '../services/FollowUpService';

class FollowUpController {
  private readonly followUpService: FollowUpService;

  constructor() {
    this.followUpService = new FollowUpService();
    this.getAll = this.getAll.bind(this);
    this.resolve = this.resolve.bind(this);
  }

  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const isAdmin = req.user!.role === 'admin';
      const followUps = isAdmin
        ? this.followUpService.getAllFollowUps()
        : this.followUpService.getUserFollowUps(req.user!.id).map(f => f.toJSON());
      res.json(followUps);
    } catch (err) {
      next(err);
    }
  }

  resolve(req: Request, res: Response, next: NextFunction): void {
    try {
      const isAdmin = req.user!.role === 'admin';
      this.followUpService.resolveFollowUp(parseInt(req.params.id), req.user!.id, isAdmin);
      res.json({ message: 'FollowUp resolved and task marked complete' });
    } catch (err) {
      next(err);
    }
  }
}

export default FollowUpController;
