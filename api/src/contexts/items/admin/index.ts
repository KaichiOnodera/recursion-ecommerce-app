import { CreateItemController } from './controllers/CreateItemController';
import { CreateItemInteractor } from './interactors/CreateItemInteractor';
import { UpdateItemController } from './controllers/UpdateItemController';
import { UpdateItemInteractor } from './interactors/UpdateItemInteractor';
import { DeleteItemController } from './controllers/DeleteItemController';
import { DeleteItemInteractor } from './interactors/DeleteItemInteractor';
import { GetItemsController } from './controllers/GetItemsController';
import { GetItemsInteractor } from '../interactors/GetItemsInteractor';
import { GetItemController } from './controllers/GetItemController';
import { GetItemInteractor } from './interactors/GetItemInteractor';
import { ItemRepository } from '../infrastructures/repositories/ItemRepository';
import { ItemImageRepository } from '../infrastructures/repositories/ItemImageRepository';
import { ItemStripeMappingRepository } from '../infrastructures/repositories/ItemStripeMappingRepository';
import { createImageStorageAdapter } from '../infrastructures/adapters/createImageStorageAdapter';
import { FavoriteRepository } from '../../favorites/infrastructures/repositories/FavoriteRepository';
import { TagRepository } from '../../tags/infrastructures/repositories/TagRepository';
import { prisma } from '../../../libs/prisma';
import express from 'express';
import { verifyAccessToken, verifyAdmin } from '../../../middlewares';

const adminItemsRouter = express.Router();

const itemImageRepository = new ItemImageRepository(prisma);
const imageStorageAdapter = createImageStorageAdapter();
const favoriteRepository = new FavoriteRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
);
const tagRepository = new TagRepository(prisma);
const itemStripeMappingRepository = new ItemStripeMappingRepository(prisma);
const itemRepository = new ItemRepository(
  prisma,
  itemImageRepository,
  imageStorageAdapter,
  favoriteRepository,
  tagRepository,
  itemStripeMappingRepository,
);

// 認証チェック
adminItemsRouter.use(verifyAccessToken);
adminItemsRouter.use(verifyAdmin);

const createItemInteractor = new CreateItemInteractor(
  itemRepository,
  itemImageRepository,
  imageStorageAdapter,
  tagRepository,
);
const createItemController = new CreateItemController(createItemInteractor);

const updateItemInteractor = new UpdateItemInteractor(
  itemRepository,
  itemImageRepository,
  imageStorageAdapter,
  tagRepository,
);
const updateItemController = new UpdateItemController(updateItemInteractor);

const deleteItemInteractor = new DeleteItemInteractor(itemRepository);
const deleteItemController = new DeleteItemController(deleteItemInteractor);

// 管理者向け: displayStatusを指定しないことで全ての商品（private含む）を取得
const getItemsInteractor = new GetItemsInteractor(itemRepository);
const getItemsController = new GetItemsController(getItemsInteractor);

const getItemInteractor = new GetItemInteractor(itemRepository);
const getItemController = new GetItemController(getItemInteractor);

adminItemsRouter.get('/', getItemsController.execute.bind(getItemsController));

adminItemsRouter.get('/:id', getItemController.execute.bind(getItemController));

adminItemsRouter.post(
  '/',
  createItemController.getMulterMiddleware(),
  createItemController.execute.bind(createItemController),
);

adminItemsRouter.patch(
  '/:id',
  updateItemController.getMulterMiddleware(),
  updateItemController.execute.bind(updateItemController),
);

adminItemsRouter.delete(
  '/:id',
  deleteItemController.execute.bind(deleteItemController),
);

export { adminItemsRouter };
