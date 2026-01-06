import express from 'express';
import { prisma } from '../../libs/prisma';
import { OrderConfirmationController } from './controllers/OrderConfirmationController';
import { OrderConfirmationInteractor } from './interactors/OrderConfirmationInteractor';
import { OrderCompletedController } from './controllers/OrderCompletedController';
import { OrderCompletedInteractor } from './interactors/OrderCompletedInteractor';
import { CartRepository } from '../cart/infrastructures/repositories/CartRepository';
import { UserRepository } from '../auth/infrastructures/repositories/UserRepository';
import { OrderRepository } from 'src/contexts/orders/infrastructures/repositories/OrderRepository';
import { EmailAdapter } from './infrastructures/adapters/EmailAdapter';
import { verifyAdmin } from 'src/middlewares';
import { VerifyTokenController } from './controllers/VerifyTokenController';
import { VerifyTokenInteractor } from './interactors/VerifyTokenInteractor';
import { CartRepository } from '../cart/infrastructures/repositories/CartRepository';
import { UserRepository } from '../users/infrastructures/repositories/UserRepository';
import { EmailAdapter } from './infrastructures/adapters/EmailAdapter';

const mailRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const userRepository = new UserRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const emailAdapter = new EmailAdapter();

const orderconfirmationInteractor = new OrderConfirmationInteractor(
  emailAdapter,
  cartRepository,
  userRepository,
);

const orderCompletedInteractor = new OrderCompletedInteractor(
  emailAdapter,
  orderRepository,
  userRepository,
);

const orderconfirmationController = new OrderConfirmationController(
  orderconfirmationInteractor,
);

const orderCompletedController = new OrderCompletedController(
  orderCompletedInteractor,
);

mailRouter.post(
  '/send-delivery-notification',
  verifyAdmin,
  orderconfirmationController.execute.bind(orderconfirmationController),
);

mailRouter.post(
  '/send-order-completed/:orderId',
  verifyAdmin,
  orderCompletedController.execute.bind(orderCompletedController),
const emailAdapter = new EmailAdapter();

const verifyTokenInteractor = new VerifyTokenInteractor(
  emailAdapter,
  userRepository,
);
const verifyTokenController = new VerifyTokenController(verifyTokenInteractor);

const orderConfirmationInteractor = new OrderConfirmationInteractor(
  emailAdapter,
  cartRepository,
  userRepository,
);
const orderConfirmationController = new OrderConfirmationController(
  orderConfirmationInteractor,
);

mailRouter.post(
  '/send-order-confirmation',
  orderConfirmationController.execute.bind(orderConfirmationController),
);

mailRouter.post(
  '/verify-email',
  verifyTokenController.execute.bind(verifyTokenController),
);

export { mailRouter };
