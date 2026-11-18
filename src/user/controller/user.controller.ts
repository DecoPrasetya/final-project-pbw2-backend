import { NextFunction, Request, Response } from 'express';
import { userService } from '../service/user.service';
import { UpdateProfileParamsSchema } from '../user';

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.getProfile(req.user!.sub);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = UpdateProfileParamsSchema.parse(req.body);
      const data = await userService.updateProfile(req.user!.sub, payload);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async listUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.listUsers();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();