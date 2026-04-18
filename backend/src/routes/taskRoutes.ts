import { Router } from 'express';
import TaskController from '../controllers/TaskController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();
const ctrl = new TaskController();

router.use(authMiddleware);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
