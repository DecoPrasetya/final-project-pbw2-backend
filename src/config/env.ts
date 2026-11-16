import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.string().min(1),
  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().int().positive().default(587),
  MAIL_USER: z.string().email(),
  MAIL_PASS: z.string().optional().default(''),
});

export const env = EnvSchema.parse(process.env);