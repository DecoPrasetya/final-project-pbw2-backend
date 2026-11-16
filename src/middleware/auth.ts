import { NextFunction, Request, Response } from 'express';
import { jwtService, JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/appError';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required');
    }
    const token = header.slice('Bearer '.length).trim();
    req.user = jwtService.verify(token);
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles: Array<'USER' | 'ADMIN'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError(401, 'Authentication required');
      if (!roles.includes(req.user.role)) {
        throw new AppError(403, 'You are not authorized to perform this action');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}