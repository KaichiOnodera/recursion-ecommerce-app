import { GetItemsController } from './controllers/GetItemsController';
import { GetItemsInteractor } from './interactors/GetItemsInteractor';
import { ItemRepository } from './infrastructures/repositories/ItemRepository';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const itemsRouter = express.Router();

const prisma = new PrismaClient();
const itemRepository = new ItemRepository(prisma);
const getItemsInteractor = new GetItemsInteractor(itemRepository);
const getItemsController = new GetItemsController(getItemsInteractor);

itemsRouter.get('/', getItemsController.execute.bind(getItemsController));

export { itemsRouter };
