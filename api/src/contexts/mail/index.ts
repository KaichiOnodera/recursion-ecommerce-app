import express from 'express';
import { prisma } from '../../libs/prisma';
import { OrderCompletedController } from './controllers/OrderCompletedController';
import { OrderCompletedInteractor } from './interactors/OrderCompletedInteractor';
import { UserRepository } from '../users/infrastructures/repositories/UserRepository';
import { OrderRepository } from 'src/contexts/orders/infrastructures/repositories/OrderRepository';
import { EmailVerificationRepository } from '../auth/infrastructures/repositories/EmailVerificationRepository';
import { EmailAdapter } from './infrastructures/adapters/EmailAdapter';
import { verifyAdmin } from 'src/middlewares';
import { VerifyTokenController } from './controllers/VerifyTokenController';
import { VerifyTokenInteractor } from './interactors/VerifyTokenInteractor';

const mailRouter = express.Router();

const userRepository = new UserRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const emailverificationtokenRepository = new EmailVerificationRepository(
  prisma,
);

const emailAdapter = new EmailAdapter();

const orderCompletedInteractor = new OrderCompletedInteractor(
  emailAdapter,
  orderRepository,
  userRepository,
);

const orderCompletedController = new OrderCompletedController(
  orderCompletedInteractor,
);

const verifyTokenInteractor = new VerifyTokenInteractor(
  emailAdapter,
  userRepository,
  emailverificationtokenRepository,
);
const verifyTokenController = new VerifyTokenController(verifyTokenInteractor);

mailRouter.post(
  '/order-completed',
  verifyAdmin,
  orderCompletedController.execute.bind(orderCompletedController),
);

mailRouter.post(
  '/verify-email',
  verifyTokenController.execute.bind(verifyTokenController),
);

export { mailRouter };
