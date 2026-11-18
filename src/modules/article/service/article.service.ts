import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/AppError';
import { slugify } from '../../../utils/tokenizer';
import type {
  CreateArticlePayload,
  ListArticleQueryPayload,
  UpdateArticlePayload,
} from '../article';

export class ArticleService {
  async create(authorId: string, payload: CreateArticlePayload) {
    const slug = slugify(payload.title) + '-' + Date.now().toString(36);
    return prisma.article.create({
      data: { ...payload, slug, authorId },
      select: {
        id: true, title: true, slug: true, excerpt: true, published: true, createdAt: true,
      },
    });
  }

  async update(id: string, payload: UpdateArticlePayload) {
    const exists = await prisma.article.findUnique({ where: { id } });
    if (!exists) throw new AppError(404, 'Article not found');
    return prisma.article.update({
      where: { id },
      data: payload,
      select: { id: true, title: true, slug: true, published: true, updatedAt: true },
    });
  }

  async remove(id: string) {
    const exists = await prisma.article.findUnique({ where: { id } });
    if (!exists) throw new AppError(404, 'Article not found');
    await prisma.article.delete({ where: { id } });
  }

  async getBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true } },
        media: { select: { id: true, type: true, title: true, url: true } },
      },
    });
    if (!article || !article.published) throw new AppError(404, 'Article not found');
    return article;
  }

  async list(query: ListArticleQueryPayload) {
    const where = {
      published: true,
      ...(query.search ? { title: { contains: query.search } } : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.article.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, title: true, slug: true, excerpt: true, coverImage: true, createdAt: true,
        },
      }),
      prisma.article.count({ where }),
    ]);
    return { items, total, page: query.page, limit: query.limit };
  }

  async listAllForAdmin() {
    return prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, published: true, createdAt: true },
    });
  }
}

export const articleService = new ArticleService();