import helmet from 'helmet';
import cors from 'cors';

export const security = [
  helmet(),
  cors({
    origin: true,
    credentials: true,
  }),
];