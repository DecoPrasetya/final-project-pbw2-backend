import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.errors.map((e) => e.message).join(', '),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  console.error('[errorHandler]', err);
  return res.status(500).json({ success: false, message: 'Internal server error' });
}