import { NextFunction, Request, Response } from 'express';
import { articleService } from '../service/article.service';
import {
  CreateArticleParamsSchema,
  ListArticleQuerySchema,
  UpdateArticleParamsSchema,
} from '../article';

export class ArticleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = CreateArticleParamsSchema.parse(req.body);
      const data = await articleService.create(req.user!.sub, payload);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = UpdateArticleParamsSchema.parse(req.body);
      const data = await articleService.update(req.params.id, payload);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await articleService.remove(req.params.id);
      res.json({ success: true, message: 'Article deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await articleService.getBySlug(req.params.slug);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ListArticleQuerySchema.parse(req.query);
      const data = await articleService.list(query);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async listAdmin(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await articleService.listAllForAdmin();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const articleController = new ArticleController();