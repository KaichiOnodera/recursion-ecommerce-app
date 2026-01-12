import express from 'express';
import { CreateWishlistController } from './controllers/CreateWishlistController';
import { CreateWishlistInteractor } from './interactors/CreateWishlistInteractor';
import { WishlistRepository } from './infrastructures/repositories/WishlistRepository';
import { ItemImageRepository } from '../items/infrastructures/repositories/ItemImageRepository';
import { createImageStorageAdapter } from '../items/infrastructures/adapters/createImageStorageAdapter';
import { prisma } from '../../libs/prisma';
import { verifyAccessToken } from '../../middlewares';

const wishlistRouter = express.Router();

const itemImageRepository = new ItemImageRepository(prisma);
const imageStorageAdapter = createImageStorageAdapter();
const wishlistRepository = new WishlistRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
);
const createWishlistInteractor = new CreateWishlistInteractor(
  wishlistRepository,
);
const createWishlistController = new CreateWishlistController(
  createWishlistInteractor,
);

wishlistRouter.post(
  '/',
  verifyAccessToken,
  createWishlistController.execute.bind(createWishlistController),
);

export { wishlistRouter };
