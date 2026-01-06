import express from 'express';
import { prisma } from '../../libs/prisma';
import { OrderConfirmationController } from './controllers/OrderConfirmationController';
import { OrderConfirmationInteractor } from './interactors/OrderConfirmationInteractor';
import { VerifyTokenController } from './controllers/VerifyTokenController';
import { VerifyTokenInteractor } from './interactors/VerifyTokenInteractor';
import { CartRepository } from '../cart/infrastructures/repositories/CartRepository';
import { UserRepository } from '../users/infrastructures/repositories/UserRepository';
import { EmailAdapter } from './infrastructures/adapters/EmailAdapter';

const mailRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const userRepository = new UserRepository(prisma);
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
