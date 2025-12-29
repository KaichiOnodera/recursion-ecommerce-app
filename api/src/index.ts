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
import { reviewsRouter } from './contexts/reviews';
import { StripeWebhookController } from './contexts/checkout/controllers/StripeWebhookController';
import { HandleStripeWebhookInteractor } from './contexts/checkout/interactors/HandleStripeWebhookInteractor';
import { StripeAdapter } from './contexts/checkout/infrastructures/adapters/StripeAdapter';
import { OrderRepository } from './contexts/orders/infrastructures/repositories/OrderRepository';
import { InventoryRepository } from './contexts/items/infrastructures/repositories/InventoryRepository';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(cookieParser());

// Webhookエンドポイントは express.json() の適用前に配置する必要がある
// Stripeの署名検証には生のリクエストボディが必要
const orderRepository = new OrderRepository(prisma);
const inventoryRepository = new InventoryRepository(prisma);

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

const stripeAdapter = new StripeAdapter(secretKey, webhookSecret);
const handleStripeWebhookInteractor = new HandleStripeWebhookInteractor(
  orderRepository,
  inventoryRepository,
  stripeAdapter,
);
const stripeWebhookController = new StripeWebhookController(
  handleStripeWebhookInteractor,
  stripeAdapter,
);

app.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhookController.execute.bind(stripeWebhookController),
);

// その他のエンドポイントには express.json() を適用
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
app.use('/reviews', reviewsRouter);

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
