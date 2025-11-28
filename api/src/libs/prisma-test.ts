import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.test' });

const globalForPrismaTest = globalThis as unknown as {
  prismaTest: PrismaClient | undefined;
};

export const prismaTest =
  globalForPrismaTest.prismaTest ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'test' ? ['error'] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrismaTest.prismaTest = prismaTest;
}
