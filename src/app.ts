import express from 'express';
import { parser } from './middleware/parser';
import { security } from './middleware/security';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import authRouter from './modules/auth/router/auth.router';

const app = express();

app.use(security);
app.use(parser);
app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/auth', authRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use(errorHandler);

export default app;