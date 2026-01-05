import express from 'express';
import { AddFavoriteController } from './controllers/AddFavoriteController';
import { RemoveFavoriteController } from './controllers/RemoveFavoriteController';
import { AddFavoriteInteractor } from './interactors/AddFavoriteInteractor';
import { RemoveFavoriteInteractor } from './interactors/RemoveFavoriteInteractor';
import { FavoriteRepository } from './infrastructures/repositories/FavoriteRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { ItemImageRepository } from '../items/infrastructures/repositories/ItemImageRepository';
import { LocalImageStorageAdapter } from '../items/infrastructures/adapters/LocalImageStorageAdapter';
import { prisma } from '../../libs/prisma';
import { verifyAccessToken } from '../../middlewares';
import * as path from 'path';

const favoritesRouter = express.Router();

const favoriteRepository = new FavoriteRepository(prisma);
const itemImageRepository = new ItemImageRepository(prisma);
const uploadDir = path.join(process.cwd(), 'uploads', 'items');
const imageStorageAdapter = new LocalImageStorageAdapter(uploadDir);
const itemRepository = new ItemRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
);
const addFavoriteInteractor = new AddFavoriteInteractor(
  favoriteRepository,
  itemRepository,
);
const removeFavoriteInteractor = new RemoveFavoriteInteractor(
  favoriteRepository,
);
const addFavoriteController = new AddFavoriteController(addFavoriteInteractor);
const removeFavoriteController = new RemoveFavoriteController(
  removeFavoriteInteractor,
);

favoritesRouter.post(
  '/',
  verifyAccessToken,
  addFavoriteController.execute.bind(addFavoriteController),
);

favoritesRouter.delete(
  '/:itemId',
  verifyAccessToken,
  removeFavoriteController.execute.bind(removeFavoriteController),
);

export { favoritesRouter };
