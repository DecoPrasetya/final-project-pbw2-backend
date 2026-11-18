import { z } from 'zod';

export const CreateMediaParamsSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO', 'INFOGRAPHIC']),
  title: z.string().trim().min(1).max(200),
  url: z.string().url('URL must be valid'),
  articleId: z.string().min(1).optional(),
});
export type CreateMediaPayload = z.infer<typeof CreateMediaParamsSchema>;