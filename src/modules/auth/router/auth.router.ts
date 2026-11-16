import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import { authenticate } from '../../../middleware/auth';
import { authLimiter } from '../../../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, authController.register.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));
router.get('/me', authenticate, authController.me.bind(authController));

export default router;