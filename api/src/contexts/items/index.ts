import { GetItemsController } from './controllers/GetItemsController';
import { GetItemsInteractor } from './interactors/GetItemsInteractor';
import { GetItemController } from './controllers/GetItemController';
import { GetItemInteractor } from './interactors/GetItemInteractor';
import { SearchItemsController } from './controllers/SearchItemsController';
import { SearchItemsInteractor } from './interactors/SearchItemsInteractor';
import { ItemRepository } from './infrastructures/repositories/ItemRepository';
import { ItemImageRepository } from './infrastructures/repositories/ItemImageRepository';
import { LocalImageStorageAdapter } from './infrastructures/adapters/LocalImageStorageAdapter';
import { DisplayStatus } from './domains/entities/Item';
import { prisma } from '../../libs/prisma';
import express from 'express';
import * as path from 'path';

const itemsRouter = express.Router();

const itemImageRepository = new ItemImageRepository(prisma);
const uploadDir = path.join(process.cwd(), 'uploads', 'items');
const imageStorageAdapter = new LocalImageStorageAdapter(uploadDir);
const itemRepository = new ItemRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
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

itemsRouter.get('/', getItemsController.execute.bind(getItemsController));
itemsRouter.get(
  '/search',
  searchItemsController.execute.bind(searchItemsController),
);
itemsRouter.get('/:id', getItemController.execute.bind(getItemController));

export { itemsRouter };
