import { PostCartController } from './controllers/PostCartController';
import { UpdateCartInteractor } from './interactors/UpdateCartInteractor';
import { GetCartController } from './controllers/GetCartController';
import { GetCartInteractor } from './interactors/GetCartInteractor';
import { MergeCartInteractor } from './interactors/MergeCartInteractor';
import { CartRepository } from './infrastructures/repositories/CartRepository';
import { CartItemRepository } from './infrastructures/repositories/CartItemRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { ItemImageRepository } from '../items/infrastructures/repositories/ItemImageRepository';
import { createImageStorageAdapter } from '../items/infrastructures/adapters/createImageStorageAdapter';
import { FavoriteRepository } from '../favorites/infrastructures/repositories/FavoriteRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { optionalVerifyAccessToken } from '../../middlewares';

const cartRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const cartItemRepository = new CartItemRepository(prisma);
const itemImageRepository = new ItemImageRepository(prisma);
const imageStorageAdapter = createImageStorageAdapter();
const favoriteRepository = new FavoriteRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
);
const itemRepository = new ItemRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
  favoriteRepository,
);
const updateCartInteractor = new UpdateCartInteractor(
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
  updateCartInteractor,
  getCartInteractor,
  mergeCartInteractor,
  cartRepository,
);

const getCartController = new GetCartController(
  getCartInteractor,
  mergeCartInteractor,
  cartRepository,
);

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
