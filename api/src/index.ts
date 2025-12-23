import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables from .env file
config();

import { itemsRouter } from './contexts/items';
import { adminItemsRouter } from './contexts/items/admin';
import { authRouter } from './contexts/auth';
import { prisma } from './libs/prisma';
import { UsersRouter as usersRouter } from './contexts/users';
import { cartRouter } from './contexts/cart';
import { checkoutRouter } from './contexts/checkout';
import { ordersRouter } from './contexts/orders';
import { adminOrdersRouter } from './contexts/orders/admin';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.get('/', async (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);
app.use('/items', itemsRouter);
app.use('/admin/items', adminItemsRouter);

app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);
app.use('/admin/orders', adminOrdersRouter);

app.listen(8000, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port 8000');
  // eslint-disable-next-line no-console
  console.log('Database URL:', process.env.DATABASE_URL);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
