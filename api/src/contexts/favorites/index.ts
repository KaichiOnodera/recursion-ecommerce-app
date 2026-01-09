import express from 'express';
import { AddFavoriteController } from './controllers/AddFavoriteController';
import { RemoveFavoriteController } from './controllers/RemoveFavoriteController';
import { GetFavoritesController } from './controllers/GetFavoritesController';
import { AddFavoriteInteractor } from './interactors/AddFavoriteInteractor';
import { RemoveFavoriteInteractor } from './interactors/RemoveFavoriteInteractor';
import { GetFavoritesInteractor } from './interactors/GetFavoritesInteractor';
import { FavoriteRepository } from './infrastructures/repositories/FavoriteRepository';
import { ItemRepository } from '../items/infrastructures/repositories/ItemRepository';
import { ItemImageRepository } from '../items/infrastructures/repositories/ItemImageRepository';
import { createImageStorageAdapter } from '../items/infrastructures/adapters/createImageStorageAdapter';
import { prisma } from '../../libs/prisma';
import { verifyAccessToken } from '../../middlewares';

const favoritesRouter = express.Router();

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
);
const addFavoriteInteractor = new AddFavoriteInteractor(
  favoriteRepository,
  itemRepository,
);
const removeFavoriteInteractor = new RemoveFavoriteInteractor(
  favoriteRepository,
);
const getFavoritesInteractor = new GetFavoritesInteractor(favoriteRepository);
const addFavoriteController = new AddFavoriteController(addFavoriteInteractor);
const removeFavoriteController = new RemoveFavoriteController(
  removeFavoriteInteractor,
);
const getFavoritesController = new GetFavoritesController(
  getFavoritesInteractor,
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

favoritesRouter.get(
  '/',
  verifyAccessToken,
  getFavoritesController.execute.bind(getFavoritesController),
);

export { favoritesRouter };
