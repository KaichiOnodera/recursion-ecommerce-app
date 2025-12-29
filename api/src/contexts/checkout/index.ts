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

const createCheckoutSessionInteractor = new CreateCheckoutSessionInteractor(
  cartRepository,
  itemRepository,
  userRepository,
  stripeAdapter,
  orderRepository,
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
