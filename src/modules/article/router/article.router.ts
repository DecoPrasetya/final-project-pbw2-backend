import { Router } from 'express';
import { articleController } from '../controller/article.controller';
import { authenticate, requireRole } from '../../../middleware/auth';

const router = Router();

router.get('/', articleController.list.bind(articleController));
router.get('/admin/all', authenticate, requireRole('ADMIN'), articleController.listAdmin.bind(articleController));
router.get('/:slug', articleController.getBySlug.bind(articleController));

router.post('/', authenticate, requireRole('ADMIN'), articleController.create.bind(articleController));
router.patch('/:id', authenticate, requireRole('ADMIN'), articleController.update.bind(articleController));
router.delete('/:id', authenticate, requireRole('ADMIN'), articleController.remove.bind(articleController));

export default router;