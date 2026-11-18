import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/AppError';
import type { UpdateProfilePayload } from '../user';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  async updateProfile(userId: string, payload: UpdateProfilePayload) {
    return prisma.user.update({
      where: { id: userId },
      data: payload,
      select: { id: true, name: true, email: true, avatar: true },
    });
  }

  async listUsers() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const userService = new UserService();