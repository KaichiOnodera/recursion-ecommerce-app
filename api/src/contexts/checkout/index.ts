import { CreateCheckoutSessionController } from './controllers/CreateCheckoutSessionController';
import { CreateCheckoutSessionInteractor } from './interactors/CreateCheckoutSessionInteractor';
import { StripeWebhookController } from './controllers/StripeWebhookController';
import { HandleStripeWebhookInteractor } from './interactors/HandleStripeWebhookInteractor';
import { StripeAdapter } from './infrastructures/adapters/StripeAdapter';
import { CartRepository } from '../cart/infrastructures/repositories/CartRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { InventoryRepository } from '../items/infrastructures/repositories/InventoryRepository';
import { UserRepository } from '../users/infrastructures/repositories/UserRepository';
import { OrderRepository } from '../orders/infrastructures/repositories/OrderRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';

const checkoutRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const itemRepository = new ItemRepository(prisma);
const inventoryRepository = new InventoryRepository(prisma);
const userRepository = new UserRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const stripeAdapter = new StripeAdapter();

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

const handleStripeWebhookInteractor = new HandleStripeWebhookInteractor(
  orderRepository,
  inventoryRepository,
);

const stripeWebhookController = new StripeWebhookController(
  handleStripeWebhookInteractor,
  stripeAdapter,
);

checkoutRouter.post(
  '/session',
  verifyAccessToken,
  createCheckoutSessionController.execute.bind(createCheckoutSessionController),
);

checkoutRouter.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhookController.execute.bind(stripeWebhookController),
);

export { checkoutRouter };
