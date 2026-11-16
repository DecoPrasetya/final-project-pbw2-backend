import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/appError';
import { jwtService } from '../../../utils/jwt';
import type { LoginParamsPayload, RegisterParamsPayload } from '../auth';

export class AuthService {
  async register(payload: RegisterParamsPayload) {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) throw new AppError(409, 'Email already registered');

    const hashed = await bcrypt.hash(payload.password, 10);
    const user = await prisma.user.create({
      data: { name: payload.name, email: payload.email, password: hashed, role: 'USER' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    const token = jwtService.sign({ sub: user.id, role: user.role as 'USER' | 'ADMIN' });
    return { user, token };
  }

  async login(payload: LoginParamsPayload) {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(payload.password, user.password);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = jwtService.sign({ sub: user.id, role: user.role as 'USER' | 'ADMIN' });
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }
}

export const authService = new AuthService();