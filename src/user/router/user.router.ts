import { Router } from 'express';
import { userController } from '../controller/user.controller';
import { authenticate, requireRole } from '../../../middleware/auth';

const router = Router();

router.get('/me', authenticate, userController.getProfile.bind(userController));
router.patch('/me', authenticate, userController.updateProfile.bind(userController));
router.get('/', authenticate, requireRole('ADMIN'), userController.listUsers.bind(userController));

export default router;