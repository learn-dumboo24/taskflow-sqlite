import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();
const ctrl = new CategoryController();

router.use(authMiddleware);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);
router.get('/task/:taskId', ctrl.getForTask);
router.post('/task/:taskId', ctrl.addToTask);
router.delete('/task/:taskId/:categoryId', ctrl.removeFromTask);

export default router;
