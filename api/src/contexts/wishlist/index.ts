import express from 'express';
import { CreateWishlistController } from './controllers/CreateWishlistController';
import { GetWishlistsController } from './controllers/GetWishlistsController';
import { GetWishlistItemsController } from './controllers/GetWishlistItemsController';
import { AddWishlistItemController } from './controllers/AddWishlistItemController';
import { RemoveWishlistItemController } from './controllers/RemoveWishlistItemController';
import { CreateWishlistInteractor } from './interactors/CreateWishlistInteractor';
import { GetWishlistsInteractor } from './interactors/GetWishlistsInteractor';
import { GetWishlistItemsInteractor } from './interactors/GetWishlistItemsInteractor';
import { AddWishlistItemInteractor } from './interactors/AddWishlistItemInteractor';
import { RemoveWishlistItemInteractor } from './interactors/RemoveWishlistItemInteractor';
import { WishlistRepository } from './infrastructures/repositories/WishlistRepository';
import { ItemImageRepository } from '../items/infrastructures/repositories/ItemImageRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { createImageStorageAdapter } from '../items/infrastructures/adapters/createImageStorageAdapter';
import { prisma } from '../../libs/prisma';
import { verifyAccessToken } from '../../middlewares';

const wishlistRouter = express.Router();

const itemImageRepository = new ItemImageRepository(prisma);
const imageStorageAdapter = createImageStorageAdapter();
const itemRepository = new ItemRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
);
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
const getWishlistsInteractor = new GetWishlistsInteractor(wishlistRepository);
const getWishlistsController = new GetWishlistsController(
  getWishlistsInteractor,
);
const getWishlistItemsInteractor = new GetWishlistItemsInteractor(
  wishlistRepository,
);
const getWishlistItemsController = new GetWishlistItemsController(
  getWishlistItemsInteractor,
);
const addWishlistItemInteractor = new AddWishlistItemInteractor(
  wishlistRepository,
  itemRepository,
);
const addWishlistItemController = new AddWishlistItemController(
  addWishlistItemInteractor,
);
const removeWishlistItemInteractor = new RemoveWishlistItemInteractor(
  wishlistRepository,
);
const removeWishlistItemController = new RemoveWishlistItemController(
  removeWishlistItemInteractor,
);

wishlistRouter.post(
  '/',
  verifyAccessToken,
  createWishlistController.execute.bind(createWishlistController),
);

wishlistRouter.get(
  '/',
  verifyAccessToken,
  getWishlistsController.execute.bind(getWishlistsController),
);

wishlistRouter.get(
  '/:wishlistId/items',
  verifyAccessToken,
  getWishlistItemsController.execute.bind(getWishlistItemsController),
);

wishlistRouter.post(
  '/:wishlistId/items',
  verifyAccessToken,
  addWishlistItemController.execute.bind(addWishlistItemController),
);

wishlistRouter.delete(
  '/:wishlistId/items/:itemId',
  verifyAccessToken,
  removeWishlistItemController.execute.bind(removeWishlistItemController),
);

export { wishlistRouter };
