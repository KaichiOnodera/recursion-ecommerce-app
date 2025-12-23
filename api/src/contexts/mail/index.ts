import express from 'express';
import { prisma } from '../../libs/prisma';
import { OrderConfirmationController } from './controllers/OrderConfirmationController';
import { OrderConfirmationInteractor } from './interactors/OrderConfirmationInteractor';
import { OrderCompletedController } from './controllers/OrderCompletedController';
import { OrderCompletedInteractor } from './interactors/OrderCompletedInteractor';
import { CartRepository } from '../cart/infrastructures/repositories/CartRepository';
import { UserRepository } from '../auth/infrastructures/repositories/UserRepository';
import { EmailAdapter } from './infrastructures/adapters/EmailAdapter';

const mailRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const userRepository = new UserRepository(prisma);
const emailAdapter = new EmailAdapter();

const orderconfirmationInteractor = new OrderConfirmationInteractor(
  emailAdapter,
  cartRepository,
  userRepository,
);

const orderCompletedInteractor = new OrderCompletedInteractor(
  emailAdapter,
  cartRepository,
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
  orderconfirmationController.execute.bind(orderconfirmationController),
);

mailRouter.post(
  '/send-order-completed',
  orderCompletedController.execute.bind(orderCompletedController),
);

export { mailRouter };
