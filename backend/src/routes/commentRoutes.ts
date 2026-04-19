import { Router } from 'express';
import CommentController from '../controllers/CommentController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();
const ctrl = new CommentController();

router.use(authMiddleware);
router.get('/task/:taskId', ctrl.getForTask);
router.post('/task/:taskId', ctrl.add);
router.delete('/:id', ctrl.remove);

export default router;
