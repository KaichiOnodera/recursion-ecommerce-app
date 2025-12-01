import { CartController } from './controllers/CartController';
import { CartInteractor } from './interactors/CartInteractor';
import { CartRepository } from './infrastructures/repositories/CartRepository';
import { CartItemRepository } from './infrastructures/repositories/CartItemRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';

const cartRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const cartItemRepository = new CartItemRepository(prisma);
const cartInteractor = new CartInteractor(cartRepository, cartItemRepository);
const cartController = new CartController(cartInteractor);

cartRouter.post(
  '/',
  verifyAccessToken,
  cartController.execute.bind(cartController),
);

export { cartRouter };
