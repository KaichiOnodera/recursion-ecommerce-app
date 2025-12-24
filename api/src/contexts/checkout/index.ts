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

checkoutRouter.post(
  '/session',
  verifyAccessToken,
  createCheckoutSessionController.execute.bind(createCheckoutSessionController),
);

export { checkoutRouter };
