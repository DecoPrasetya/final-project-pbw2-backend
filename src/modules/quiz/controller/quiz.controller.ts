import { NextFunction, Request, Response } from 'express';
import { quizService } from '../service/quiz.service';
import {
  CreateQuizParamsSchema,
  SubmitQuizAttemptParamsSchema,
  UpdateQuizParamsSchema,
} from '../quiz';

export class QuizController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = CreateQuizParamsSchema.parse(req.body);
      const data = await quizService.create(req.user!.sub, payload);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = UpdateQuizParamsSchema.parse(req.body);
      const data = await quizService.update(req.params.id, payload);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await quizService.remove(req.params.id);
      res.json({ success: true, message: 'Quiz deleted' });
    } catch (error) {
      next(error);
    }
  }

  async getForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await quizService.getById(req.params.id, true);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await quizService.list();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await quizService.getById(req.params.id, false);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async submitAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = SubmitQuizAttemptParamsSchema.parse(req.body);
      const data = await quizService.submitAttempt(req.user!.sub, req.params.id, payload);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async myAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await quizService.listAttemptsByUser(req.user!.sub);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const quizController = new QuizController();