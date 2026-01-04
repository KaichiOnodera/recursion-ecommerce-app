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
import { UploadItemImagesController } from './controllers/UploadItemImagesController';
import { UploadItemImagesInteractor } from './interactors/UploadItemImagesInteractor';
import { ItemRepository } from '../infrastructures/repositories/ItemRepository';
import { ItemImageRepository } from '../infrastructures/repositories/ItemImageRepository';
import { LocalImageStorageAdapter } from '../infrastructures/adapters/LocalImageStorageAdapter';
import { prisma } from '../../../libs/prisma';
import express from 'express';
import { verifyAccessToken, verifyAdmin } from '../../../middlewares';
import * as path from 'path';

const adminItemsRouter = express.Router();

const itemRepository = new ItemRepository(prisma);
const itemImageRepository = new ItemImageRepository(prisma);
const uploadDir = path.join(process.cwd(), 'uploads', 'items');
const imageStorageAdapter = new LocalImageStorageAdapter(uploadDir);

// 認証チェック
adminItemsRouter.use(verifyAccessToken);
adminItemsRouter.use(verifyAdmin);

const createItemInteractor = new CreateItemInteractor(itemRepository);
const createItemController = new CreateItemController(createItemInteractor);

const updateItemInteractor = new UpdateItemInteractor(itemRepository);
const updateItemController = new UpdateItemController(updateItemInteractor);

const deleteItemInteractor = new DeleteItemInteractor(itemRepository);
const deleteItemController = new DeleteItemController(deleteItemInteractor);

const getItemsInteractor = new GetItemsInteractor(itemRepository);
const getItemsController = new GetItemsController(getItemsInteractor);

const getItemInteractor = new GetItemInteractor(itemRepository);
const getItemController = new GetItemController(getItemInteractor);

adminItemsRouter.get('/', getItemsController.execute.bind(getItemsController));

adminItemsRouter.get('/:id', getItemController.execute.bind(getItemController));

adminItemsRouter.post(
  '/',
  createItemController.execute.bind(createItemController),
);

adminItemsRouter.patch(
  '/:id',
  updateItemController.execute.bind(updateItemController),
);

adminItemsRouter.delete(
  '/:id',
  deleteItemController.execute.bind(deleteItemController),
);

// 画像アップロード
const uploadItemImagesInteractor = new UploadItemImagesInteractor(
  itemRepository,
  itemImageRepository,
  imageStorageAdapter,
);
const uploadItemImagesController = new UploadItemImagesController(
  uploadItemImagesInteractor,
);

adminItemsRouter.post(
  '/:id/images',
  uploadItemImagesController.getMulterMiddleware(),
  uploadItemImagesController.execute.bind(uploadItemImagesController),
);

export { adminItemsRouter };
