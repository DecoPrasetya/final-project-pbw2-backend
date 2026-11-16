import app from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to MySQL via Prisma');

    app.listen(env.PORT, () => {
      console.log(`🚀 SDG7Learn API listening on http://localhost:${env.PORT}`);
      console.log(`   NODE_ENV = ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();