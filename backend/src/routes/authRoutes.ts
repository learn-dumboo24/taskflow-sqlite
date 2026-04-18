import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();
const ctrl = new AuthController();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

export default router;
