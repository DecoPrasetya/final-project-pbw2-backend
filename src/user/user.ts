import { z } from 'zod';

export const UpdateProfileParamsSchema = z.object({
  name: z.string('Name must be a string').trim().min(1).max(100).optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
});
export type UpdateProfilePayload = z.infer<typeof UpdateProfileParamsSchema>;