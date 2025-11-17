import { CreateItemController } from './controllers/CreateItemController';
import { CreateItemInteractor } from './interactors/CreateItemInteractor';
import { UpdateItemController } from './controllers/UpdateItemController';
import { UpdateItemInteractor } from './interactors/UpdateItemInteractor';
import { DeleteItemController } from './controllers/DeleteItemController';
import { DeleteItemInteractor } from './interactors/DeleteItemInteractor';
import { GetItemsController } from './controllers/GetItemsController';
import { GetItemsInteractor } from '../interactors/GetItemsInteractor';
import { ItemRepository } from '../infrastructures/repositories/ItemRepository';
import { prisma } from '../../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../../middlewares/verifyAccesToken';
import { verifyAdmin } from '../../../middlewares/verifyAdmin';

const adminItemsRouter = express.Router();

const itemRepository = new ItemRepository(prisma);

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

adminItemsRouter.get('/', getItemsController.execute.bind(getItemsController));

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

export { adminItemsRouter };
