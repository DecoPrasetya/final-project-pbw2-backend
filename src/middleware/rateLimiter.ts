import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});