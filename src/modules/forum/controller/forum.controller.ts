import { NextFunction, Request, Response } from 'express';
import { forumService } from '../service/forum.service';
import {
  CreateForumParamsSchema,
  CreatePostParamsSchema,
  CreateReplyParamsSchema,
} from '../forum';

export class ForumController {
  async createForum(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = CreateForumParamsSchema.parse(req.body);
      const data = await forumService.createForum(payload);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async listForums(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await forumService.listForums();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getForum(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await forumService.getForumBySlug(req.params.slug);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = CreatePostParamsSchema.parse(req.body);
      const data = await forumService.createPost(req.params.forumId, req.user!.sub, payload);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await forumService.getPostWithReplies(req.params.postId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createReply(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = CreateReplyParamsSchema.parse(req.body);
      const data = await forumService.createReply(req.params.postId, req.user!.sub, payload);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      await forumService.deletePost(req.params.postId);
      res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
      next(error);
    }
  }

  async deleteReply(req: Request, res: Response, next: NextFunction) {
    try {
      await forumService.deleteReply(req.params.replyId);
      res.json({ success: true, message: 'Reply deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const forumController = new ForumController();