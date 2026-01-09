import { GetItemsController } from './controllers/GetItemsController';
import { GetItemsInteractor } from './interactors/GetItemsInteractor';
import { GetItemController } from './controllers/GetItemController';
import { GetItemInteractor } from './interactors/GetItemInteractor';
import { SearchItemsController } from './controllers/SearchItemsController';
import { SearchItemsInteractor } from './interactors/SearchItemsInteractor';
import { ItemRepository } from './infrastructures/repositories/ItemRepository';
import { ItemImageRepository } from './infrastructures/repositories/ItemImageRepository';
import { createImageStorageAdapter } from './infrastructures/adapters/createImageStorageAdapter';
import { FavoriteRepository } from '../favorites/infrastructures/repositories/FavoriteRepository';
import { DisplayStatus } from './domains/entities/Item';
import { prisma } from '../../libs/prisma';
import { optionalVerifyAccessToken } from '../../middlewares';
import express from 'express';

const itemsRouter = express.Router();

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
// 一般ユーザー向け: PUBLICな商品のみ取得
const getItemsInteractor = new GetItemsInteractor(
  itemRepository,
  DisplayStatus.PUBLIC,
);
const getItemsController = new GetItemsController(getItemsInteractor);
const getItemInteractor = new GetItemInteractor(itemRepository);
const getItemController = new GetItemController(getItemInteractor);
const searchItemsInteractor = new SearchItemsInteractor(itemRepository);
const searchItemsController = new SearchItemsController(searchItemsInteractor);

itemsRouter.get(
  '/',
  optionalVerifyAccessToken,
  getItemsController.execute.bind(getItemsController),
);
itemsRouter.get(
  '/search',
  optionalVerifyAccessToken,
  searchItemsController.execute.bind(searchItemsController),
);
itemsRouter.get(
  '/:id',
  optionalVerifyAccessToken,
  getItemController.execute.bind(getItemController),
);

export { itemsRouter };
