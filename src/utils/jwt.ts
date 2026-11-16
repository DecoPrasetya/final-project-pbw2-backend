import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './appError';

export type JwtPayload = {
  sub: string;
  role: 'USER' | 'ADMIN';
};

export class JwtService {
  sign(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  }

  verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError(401, 'Invalid or expired token');
    }
  }
}

export const jwtService = new JwtService();