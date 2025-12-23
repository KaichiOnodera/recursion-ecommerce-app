import { CartController } from './controllers/CartController';
import { CartInteractor } from './interactors/CartInteractor';
import { GetCartController } from './controllers/GetCartController';
import { GetCartInteractor } from './interactors/GetCartInteractor';
import { CartRepository } from './infrastructures/repositories/CartRepository';
import { CartItemRepository } from './infrastructures/repositories/CartItemRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';

const cartRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const cartItemRepository = new CartItemRepository(prisma);
const itemRepository = new ItemRepository(prisma);
const cartInteractor = new CartInteractor(
  cartRepository,
  cartItemRepository,
  itemRepository,
);
const cartController = new CartController(cartInteractor);

const getCartInteractor = new GetCartInteractor(cartRepository);
const getCartController = new GetCartController(getCartInteractor);

cartRouter.get(
  '/',
  verifyAccessToken,
  getCartController.execute.bind(getCartController),
);

cartRouter.post(
  '/',
  verifyAccessToken,
  cartController.execute.bind(cartController),
);

export { cartRouter };
