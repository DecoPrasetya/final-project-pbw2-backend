import { z } from 'zod';

export const CreateArticleParamsSchema = z.object({
  title: z.string('Title must be a string').trim().min(1, 'Title is required').max(200),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(1, 'Content is required'),
  coverImage: z.string().url('Cover image must be a valid URL').optional(),
  published: z.boolean().optional(),
});
export type CreateArticlePayload = z.infer<typeof CreateArticleParamsSchema>;

export const UpdateArticleParamsSchema = CreateArticleParamsSchema.partial();
export type UpdateArticlePayload = z.infer<typeof UpdateArticleParamsSchema>;

export const ListArticleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
});
export type ListArticleQueryPayload = z.infer<typeof ListArticleQuerySchema>;