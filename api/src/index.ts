// 環境変数を最初に読み込む（他のモジュールより先に実行される必要がある）
import './config/env';

import express, { Request, Response } from 'express';
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

import { itemsRouter } from './contexts/items';
import { adminItemsRouter } from './contexts/items/admin';
import { tagsRouter } from './contexts/tags';
import { adminTagsRouter } from './contexts/tags/admin';
import { authRouter } from './contexts/auth';
import { prisma } from './libs/prisma';
import { UsersRouter as usersRouter } from './contexts/users';
import { cartRouter } from './contexts/cart';
import { checkoutRouter } from './contexts/checkout';
import { ordersRouter } from './contexts/orders';
import { adminOrdersRouter } from './contexts/orders/admin';
import { reviewsRouter } from './contexts/reviews';
import { favoritesRouter } from './contexts/favorites';
import { wishlistRouter } from './contexts/wishlist';
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

// 静的ファイル配信: 画像ファイルを /images/items パスで配信（ローカル環境のみ）
const storageType = process.env.STORAGE_TYPE ?? 'local';
if (storageType === 'local') {
  app.use(
    '/images/items',
    express.static(path.join(process.cwd(), 'uploads', 'items')),
  );
}

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

// APIプレフィックスを環境変数から取得（デフォルトは空文字列 = ローカル環境用）
// ステージング/本番環境では ALB が /api/* をルーティングするため、/api プレフィックスが必要
const apiPrefix = process.env.API_PREFIX ?? '';

app.post(
  `${apiPrefix}/webhooks/stripe`,
  express.raw({ type: 'application/json' }),
  stripeWebhookController.execute.bind(stripeWebhookController),
);

// その他のエンドポイントには express.json() を適用
app.use(express.json());

app.get(`${apiPrefix}/`, async (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/items`, itemsRouter);
app.use(`${apiPrefix}/tags`, tagsRouter);
app.use(`${apiPrefix}/admin/items`, adminItemsRouter);
app.use(`${apiPrefix}/admin/tags`, adminTagsRouter);

app.use(`${apiPrefix}/users`, usersRouter);
app.use(`${apiPrefix}/cart`, cartRouter);
app.use(`${apiPrefix}/checkout`, checkoutRouter);
app.use(`${apiPrefix}/orders`, ordersRouter);
app.use(`${apiPrefix}/admin/orders`, adminOrdersRouter);
app.use(`${apiPrefix}/reviews`, reviewsRouter);
app.use(`${apiPrefix}/favorites`, favoritesRouter);
app.use(`${apiPrefix}/wishlist`, wishlistRouter);

app.listen(8000, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port 8000');
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
