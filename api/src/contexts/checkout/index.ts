import { CreateCheckoutSessionController } from './controllers/CreateCheckoutSessionController';
import { CreateCheckoutSessionInteractor } from './interactors/CreateCheckoutSessionInteractor';
import { StripeAdapter } from './infrastructures/adapters/StripeAdapter';
import { CartRepository } from '../cart/infrastructures/repositories/CartRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { UserRepository } from '../users/infrastructures/repositories/UserRepository';
import { OrderRepository } from '../orders/infrastructures/repositories/OrderRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';

const checkoutRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const itemRepository = new ItemRepository(prisma);
const userRepository = new UserRepository(prisma);
const orderRepository = new OrderRepository(prisma);

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}
const stripeAdapter = new StripeAdapter(secretKey, webhookSecret);

// 環境変数からURLを取得（未設定の場合はデフォルト値を使用）
const successUrlEnv = process.env.CHECKOUT_SUCCESS_URL?.trim();
const successUrl =
  successUrlEnv && successUrlEnv.length > 0
    ? successUrlEnv
    : 'http://localhost:3000/order/complete';
const cancelUrlEnv = process.env.CHECKOUT_CANCEL_URL?.trim();
const cancelUrl =
  cancelUrlEnv && cancelUrlEnv.length > 0
    ? cancelUrlEnv
    : 'http://localhost:3000/products';

const createCheckoutSessionInteractor = new CreateCheckoutSessionInteractor(
  cartRepository,
  itemRepository,
  userRepository,
  stripeAdapter,
  orderRepository,
  successUrl,
  cancelUrl,
);

const createCheckoutSessionController = new CreateCheckoutSessionController(
  createCheckoutSessionInteractor,
);

checkoutRouter.post(
  '/session',
  verifyAccessToken,
  createCheckoutSessionController.execute.bind(createCheckoutSessionController),
);

export { checkoutRouter };
