import { Router } from 'express';
import StatsController from '../controllers/StatsController';
import authMiddleware from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();
const ctrl = new StatsController();

router.use(authMiddleware);
router.get('/app', requireRole('admin'), ctrl.getAppStats);
router.get('/me', ctrl.getUserStats);

export default router;
