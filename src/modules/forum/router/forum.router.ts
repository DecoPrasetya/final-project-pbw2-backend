import { Router } from 'express';
import { forumController } from '../controller/forum.controller';
import { authenticate, requireRole } from '../../../middleware/auth';

const router = Router();

router.get('/', forumController.listForums.bind(forumController));
router.get('/posts/:postId', forumController.getPost.bind(forumController));
router.get('/:slug', forumController.getForum.bind(forumController));

router.post('/', authenticate, requireRole('ADMIN'), forumController.createForum.bind(forumController));
router.post('/:forumId/posts', authenticate, forumController.createPost.bind(forumController));
router.post('/posts/:postId/replies', authenticate, forumController.createReply.bind(forumController));

router.delete('/posts/:postId', authenticate, requireRole('ADMIN'), forumController.deletePost.bind(forumController));
router.delete('/replies/:replyId', authenticate, requireRole('ADMIN'), forumController.deleteReply.bind(forumController));

export default router;