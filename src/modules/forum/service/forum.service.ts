import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/AppError';
import { slugify } from '../../../utils/tokenizer';
import type {
  CreateForumPayload,
  CreatePostPayload,
  CreateReplyPayload,
} from '../forum';

export class ForumService {
  async createForum(payload: CreateForumPayload) {
    const slug = slugify(payload.title) + '-' + Date.now().toString(36);
    return prisma.forum.create({ data: { ...payload, slug } });
  }

  async listForums() {
    return prisma.forum.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { posts: true } } },
    });
  }

  async getForumBySlug(slug: string) {
    const forum = await prisma.forum.findUnique({
      where: { slug },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true } },
            _count: { select: { replies: true } },
          },
        },
      },
    });
    if (!forum) throw new AppError(404, 'Forum not found');
    return forum;
  }

  async createPost(forumId: string, authorId: string, payload: CreatePostPayload) {
    const forum = await prisma.forum.findUnique({ where: { id: forumId } });
    if (!forum) throw new AppError(404, 'Forum not found');
    return prisma.forumPost.create({
      data: { forumId, authorId, content: payload.content },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async getPostWithReplies(postId: string) {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true } } },
        },
      },
    });
    if (!post) throw new AppError(404, 'Post not found');
    return post;
  }

  async createReply(postId: string, authorId: string, payload: CreateReplyPayload) {
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    return prisma.forumReply.create({
      data: { postId, authorId, content: payload.content },
      include: { author: { select: { id: true, name: true } } },
    });
  }

  async deletePost(postId: string) {
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) throw new AppError(404, 'Post not found');
    await prisma.forumPost.delete({ where: { id: postId } });
  }

  async deleteReply(replyId: string) {
    const reply = await prisma.forumReply.findUnique({ where: { id: replyId } });
    if (!reply) throw new AppError(404, 'Reply not found');
    await prisma.forumReply.delete({ where: { id: replyId } });
  }
}

export const forumService = new ForumService();