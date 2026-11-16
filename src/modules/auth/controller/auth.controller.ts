import { NextFunction, Request, Response } from 'express';
import { authService } from '../service/auth.service';
import { LoginParamsSchema, RegisterParamsSchema } from '../auth';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = RegisterParamsSchema.parse(req.body);
      const result = await authService.register(payload);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = LoginParamsSchema.parse(req.body);
      const result = await authService.login(payload);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.sub);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();