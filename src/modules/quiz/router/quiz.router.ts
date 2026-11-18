import { Router } from 'express';
import { quizController } from '../controller/quiz.controller';
import { authenticate, requireRole } from '../../../middleware/auth';

const router = Router();

router.post('/', authenticate, requireRole('ADMIN'), quizController.create.bind(quizController));
router.patch('/:id', authenticate, requireRole('ADMIN'), quizController.update.bind(quizController));
router.delete('/:id', authenticate, requireRole('ADMIN'), quizController.remove.bind(quizController));
router.get('/admin/:id', authenticate, requireRole('ADMIN'), quizController.getForAdmin.bind(quizController));

router.get('/', quizController.list.bind(quizController));
router.get('/me/attempts', authenticate, quizController.myAttempts.bind(quizController));
router.get('/:id', quizController.getById.bind(quizController));

router.post('/:id/attempts', authenticate, quizController.submitAttempt.bind(quizController));

export default router;