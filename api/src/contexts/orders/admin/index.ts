import { GetOrdersController } from './controllers/GetOrdersController';
import { GetOrdersInteractor } from './interactors/GetOrdersInteractor';
import { GetOrdersNeedingShippingController } from './controllers/GetOrdersNeedingShippingController';
import { GetOrdersNeedingShippingInteractor } from './interactors/GetOrdersNeedingShippingInteractor';
import { OrderRepository } from '../infrastructures/repositories/OrderRepository';
import { prisma } from '../../../libs/prisma';
import express from 'express';
import { verifyAccessToken, verifyAdmin } from '../../../middlewares';

const adminOrdersRouter = express.Router();

const orderRepository = new OrderRepository(prisma);
const getOrdersInteractor = new GetOrdersInteractor(orderRepository);
const getOrdersController = new GetOrdersController(getOrdersInteractor);
const getOrdersNeedingShippingInteractor =
  new GetOrdersNeedingShippingInteractor(orderRepository);
const getOrdersNeedingShippingController =
  new GetOrdersNeedingShippingController(getOrdersNeedingShippingInteractor);

adminOrdersRouter.use(verifyAccessToken);
adminOrdersRouter.use(verifyAdmin);

adminOrdersRouter.get(
  '/',
  getOrdersController.execute.bind(getOrdersController),
);

adminOrdersRouter.get(
  '/shipping-needed',
  getOrdersNeedingShippingController.execute.bind(
    getOrdersNeedingShippingController,
  ),
);

export { adminOrdersRouter };
