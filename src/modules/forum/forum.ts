import { z } from 'zod';

export const CreateForumParamsSchema = z.object({
  title: z.string('Title must be a string').trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
});
export type CreateForumPayload = z.infer<typeof CreateForumParamsSchema>;

export const CreatePostParamsSchema = z.object({
  content: z.string('Content must be a string').trim().min(1, 'Content is required').max(5000),
});
export type CreatePostPayload = z.infer<typeof CreatePostParamsSchema>;

export const CreateReplyParamsSchema = z.object({
  content: z.string('Content must be a string').trim().min(1, 'Content is required').max(5000),
});
export type CreateReplyPayload = z.infer<typeof CreateReplyParamsSchema>;