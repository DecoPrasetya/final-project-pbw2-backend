import { Router } from 'express';
import { mediaController } from '../controller/media.controller';
import { authenticate, requireRole } from '../../../middleware/auth';

const router = Router();

router.get('/article/:articleId', mediaController.listByArticle.bind(mediaController));
router.post('/', authenticate, requireRole('ADMIN'), mediaController.create.bind(mediaController));
router.delete('/:id', authenticate, requireRole('ADMIN'), mediaController.remove.bind(mediaController));

export default router;
