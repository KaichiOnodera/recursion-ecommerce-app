import { PostCartController } from './controllers/PostCartController';
import { CartInteractor } from './interactors/CartInteractor';
import { GetCartController } from './controllers/GetCartController';
import { GetCartInteractor } from './interactors/GetCartInteractor';
import { MergeCartInteractor } from './interactors/MergeCartInteractor';
import { CartRepository } from './infrastructures/repositories/CartRepository';
import { CartItemRepository } from './infrastructures/repositories/CartItemRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { optionalVerifyAccessToken } from '../../middlewares';

const cartRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const cartItemRepository = new CartItemRepository(prisma);
const itemRepository = new ItemRepository(prisma);
const cartInteractor = new CartInteractor(
  cartRepository,
  cartItemRepository,
  itemRepository,
);
const getCartInteractor = new GetCartInteractor(cartRepository);
const mergeCartInteractor = new MergeCartInteractor(
  cartRepository,
  cartItemRepository,
);
const cartController = new PostCartController(
  cartInteractor,
  getCartInteractor,
  mergeCartInteractor,
  cartRepository,
);

const getCartController = new GetCartController(getCartInteractor);

cartRouter.get(
  '/',
  optionalVerifyAccessToken,
  getCartController.execute.bind(getCartController),
);

cartRouter.post(
  '/',
  optionalVerifyAccessToken,
  cartController.execute.bind(cartController),
);

export { cartRouter };
