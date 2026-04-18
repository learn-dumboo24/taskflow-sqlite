import { Router } from 'express';
import FollowUpController from '../controllers/FollowUpController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();
const ctrl = new FollowUpController();

router.use(authMiddleware);
router.get('/', ctrl.getAll);
router.patch('/:id/resolve', ctrl.resolve);

export default router;
