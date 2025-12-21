import { GetOrdersController } from './controllers/GetOrdersController';
import { GetOrdersInteractor } from './interactors/GetOrdersInteractor';
import { OrderRepository } from './infrastructures/repositories/OrderRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';

const ordersRouter = express.Router();

const orderRepository = new OrderRepository(prisma);
const getOrdersInteractor = new GetOrdersInteractor(orderRepository);
const getOrdersController = new GetOrdersController(getOrdersInteractor);

ordersRouter.get(
  '/',
  verifyAccessToken,
  getOrdersController.execute.bind(getOrdersController),
);

export { ordersRouter };
