import { NextFunction, Request, Response } from 'express';
import { mediaService } from '../service/media.service';
import { CreateMediaParamsSchema } from '../media';

export class MediaController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = CreateMediaParamsSchema.parse(req.body);
      const data = await mediaService.create(payload);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async listByArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await mediaService.listByArticle(req.params.articleId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await mediaService.remove(req.params.id);
      res.json({ success: true, message: 'Media deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();