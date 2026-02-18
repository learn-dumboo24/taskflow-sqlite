const FollowUpService = require('../services/FollowUpService');

class FollowUpController {
  constructor() {
    this.followUpService = new FollowUpService();
    this.getAll = this.getAll.bind(this);
    this.resolve = this.resolve.bind(this);
  }

  getAll(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      const followUps = isAdmin
        ? this.followUpService.getAllFollowUps()
        : this.followUpService.getUserFollowUps(req.user.id);
      res.json(followUps);
    } catch (err) {
      next(err);
    }
  }

  resolve(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      this.followUpService.resolveFollowUp(
        parseInt(req.params.id),
        req.user.id,
        isAdmin
      );
      res.json({ message: 'FollowUp resolved and task marked complete' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FollowUpController;
