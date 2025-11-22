import { GetItemsController } from './controllers/GetItemsController';
import { GetItemsInteractor } from './interactors/GetItemsInteractor';
import { ItemRepository } from './infrastructures/repositories/ItemRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';

const itemsRouter = express.Router();

const itemRepository = new ItemRepository(prisma);
const getItemsInteractor = new GetItemsInteractor(itemRepository);
const getItemsController = new GetItemsController(getItemsInteractor);

itemsRouter.get('/', getItemsController.execute.bind(getItemsController));

export { itemsRouter };
