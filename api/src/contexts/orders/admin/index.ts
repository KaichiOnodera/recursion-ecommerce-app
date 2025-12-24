import { GetOrdersController } from './controllers/GetOrdersController';
import { GetOrdersInteractor } from './interactors/GetOrdersInteractor';
import { OrderRepository } from '../infrastructures/repositories/OrderRepository';
import { prisma } from '../../../libs/prisma';
import express from 'express';
import { verifyAccessToken, verifyAdmin } from '../../../middlewares';

const adminOrdersRouter = express.Router();

const orderRepository = new OrderRepository(prisma);
const getOrdersInteractor = new GetOrdersInteractor(orderRepository);
const getOrdersController = new GetOrdersController(getOrdersInteractor);

adminOrdersRouter.use(verifyAccessToken);
adminOrdersRouter.use(verifyAdmin);

adminOrdersRouter.get(
  '/',
  getOrdersController.execute.bind(getOrdersController),
);

export { adminOrdersRouter };
