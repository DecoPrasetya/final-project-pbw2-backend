import { redis } from '../lib/redis';

const PREFIX = 'sdg7learn:';

export async function setCache(key: string, value: unknown, ttlSec = 300): Promise<void> {
  await redis.set(`${PREFIX}${key}`, JSON.stringify(value), 'EX', ttlSec);
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await redis.get(`${PREFIX}${key}`);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function delCache(key: string): Promise<void> {
  await redis.del(`${PREFIX}${key}`);
}