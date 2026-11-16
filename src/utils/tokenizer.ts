import crypto from 'crypto';

export function generateRandomToken(size = 32): string {
  return crypto.randomBytes(size).toString('hex');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}