import { GetItemsController } from './controllers/GetItemsController';
import { GetItemsInteractor } from './interactors/GetItemsInteractor';
import { SearchItemsController } from './controllers/SearchItemsController';
import { SearchItemsInteractor } from './interactors/SearchItemsInteractor';
import { ItemRepository } from './infrastructures/repositories/ItemRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';

const itemsRouter = express.Router();

const itemRepository = new ItemRepository(prisma);
const getItemsInteractor = new GetItemsInteractor(itemRepository);
const getItemsController = new GetItemsController(getItemsInteractor);
const searchItemsInteractor = new SearchItemsInteractor(itemRepository);
const searchItemsController = new SearchItemsController(searchItemsInteractor);

itemsRouter.get('/', getItemsController.execute.bind(getItemsController));
itemsRouter.get(
  '/search',
  searchItemsController.execute.bind(searchItemsController),
);

export { itemsRouter };
