import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import * as fs from 'fs';

// 本番環境（Docker）でのみ module-alias を使用
// ローカル開発環境では tsx が TypeScript の paths 設定を理解するため不要
// shared/dist が存在する場合（ビルド後）のみ module-alias を設定
const sharedDistPath = path.join(process.cwd(), '../shared/dist');
if (fs.existsSync(sharedDistPath)) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('module-alias/register');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const moduleAlias = require('module-alias');

  // パスエイリアスの設定（@sharedをshared/distにマッピング）
  // 実行時の作業ディレクトリは /app/api なので、../shared/dist で /app/shared/dist を指す
  moduleAlias.addAlias('@shared', sharedDistPath);
}

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
import { favoritesRouter } from './contexts/favorites';
import { StripeWebhookController } from './contexts/checkout/controllers/StripeWebhookController';
import { HandleStripeWebhookInteractor } from './contexts/checkout/interactors/HandleStripeWebhookInteractor';
import { StripeAdapter } from './contexts/checkout/infrastructures/adapters/StripeAdapter';
import { OrderRepository } from './contexts/orders/infrastructures/repositories/OrderRepository';
import { InventoryRepository } from './contexts/items/infrastructures/repositories/InventoryRepository';
import { CartRepository } from './contexts/cart/infrastructures/repositories/CartRepository';
import { CartItemRepository } from './contexts/cart/infrastructures/repositories/CartItemRepository';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use(cookieParser());

// 静的ファイル配信: 画像ファイルを /images/items パスで配信
app.use(
  '/images/items',
  express.static(path.join(process.cwd(), 'uploads', 'items')),
);

// Webhookエンドポイントは express.json() の適用前に配置する必要がある
// Stripeの署名検証には生のリクエストボディが必要
const orderRepository = new OrderRepository(prisma);
const inventoryRepository = new InventoryRepository(prisma);
const cartRepository = new CartRepository(prisma);
const cartItemRepository = new CartItemRepository(prisma);

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
  cartRepository,
  cartItemRepository,
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

// ALBが /api/* をルーティングするため、/api プレフィックスを追加
// ローカル開発環境では /api プレフィックスなしでも動作するように、
// 環境変数で制御可能にする
const apiPrefix = process.env.API_PREFIX ?? '/api';

app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/items`, itemsRouter);
app.use(`${apiPrefix}/admin/items`, adminItemsRouter);

app.use(`${apiPrefix}/users`, usersRouter);
app.use(`${apiPrefix}/cart`, cartRouter);
app.use(`${apiPrefix}/checkout`, checkoutRouter);
app.use(`${apiPrefix}/orders`, ordersRouter);
app.use(`${apiPrefix}/admin/orders`, adminOrdersRouter);
app.use(`${apiPrefix}/reviews`, reviewsRouter);
app.use(`${apiPrefix}/favorites`, favoritesRouter);

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
