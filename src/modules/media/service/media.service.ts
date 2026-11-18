import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/AppError';
import type { CreateMediaPayload } from '../media';

export class MediaService {
  async create(payload: CreateMediaPayload) {
    if (payload.articleId) {
      const exists = await prisma.article.findUnique({ where: { id: payload.articleId } });
      if (!exists) throw new AppError(404, 'Article not found');
    }
    return prisma.media.create({ data: payload });
  }

  async listByArticle(articleId: string) {
    return prisma.media.findMany({ where: { articleId }, orderBy: { createdAt: 'desc' } });
  }

  async remove(id: string) {
    const exists = await prisma.media.findUnique({ where: { id } });
    if (!exists) throw new AppError(404, 'Media not found');
    await prisma.media.delete({ where: { id } });
  }
}

export const mediaService = new MediaService();