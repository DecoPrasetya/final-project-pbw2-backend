import { z } from 'zod';

export const RegisterParamsSchema = z.object({
  name: z.string({ message: 'Name must be a string' }).trim().min(1, 'Name is required').max(100),
  email: z
    .string({ message: 'Email must be a string' })
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string({ message: 'Password must be a string' })
    .min(8, 'Password must be at least 8 characters')
    .max(100),
});
export type RegisterParamsPayload = z.infer<typeof RegisterParamsSchema>;

export const LoginParamsSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginParamsPayload = z.infer<typeof LoginParamsSchema>;