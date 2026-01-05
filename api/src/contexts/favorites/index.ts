import express from 'express';
import { AddFavoriteController } from './controllers/AddFavoriteController';
import { AddFavoriteInteractor } from './interactors/AddFavoriteInteractor';
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
const addFavoriteController = new AddFavoriteController(addFavoriteInteractor);

favoritesRouter.post(
  '/',
  verifyAccessToken,
  addFavoriteController.execute.bind(addFavoriteController),
);

export { favoritesRouter };
