import Redis from 'ioredis';
import { env } from '../config/env';

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: false,
  maxRetriesPerRequest: 2,
});

redis.on('error', (err) => {
  console.warn('[Redis] error:', err.message);
});