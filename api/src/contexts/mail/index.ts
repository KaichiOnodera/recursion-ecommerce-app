import express from 'express';
import { optionalVerifyAccessToken } from 'src/middlewares';
import { OrderItemFileRepository } from 'src/contexts/orders/infrastructures/repositories/OrderItemFileRepository';
import { OrderRepository } from 'src/contexts/orders/infrastructures/repositories/OrderRepository';
import { DownloadTokenRepository } from '../items/infrastructures/repositories/DownloadTokenRepository';
import { SendDownloadTokenInteractor } from './interactors/SendDownloadTokenInteractor';
import { SendDownloadTokenController } from './controllers/SendDownloadTokenController';
import { UserRepository } from 'src/contexts/auth/infrastructures/repositories/UserRepository';
import { prisma } from 'src/libs/prisma';
import { IEmailAdapter } from './domains/adapters/IEmailAdapter';
import { EmailAdapter } from './infrastructures/adapters/EmailAdapter';

const mailRouter = express.Router();

const emailAdapter: IEmailAdapter = new EmailAdapter();

const userRepository = new UserRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const orderItemFileRepository = new OrderItemFileRepository(prisma);
const downloadTokenRepository = new DownloadTokenRepository(prisma);

const sendDownloadTokenInteractor = new SendDownloadTokenInteractor(
  downloadTokenRepository,
  orderItemFileRepository,
  userRepository,
  orderRepository,
  emailAdapter,
);
const sendDownloadTokenController = new SendDownloadTokenController(
  sendDownloadTokenInteractor,
);

mailRouter.post(
  '/CreateDownloadToken',
  optionalVerifyAccessToken,
  SendDownloadTokenController.execute.bind(sendDownloadTokenController),
);

export { mailRouter };
