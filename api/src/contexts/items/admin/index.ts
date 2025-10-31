import { CreateItemController } from './controllers/CreateItemController';
import { CreateItemInteractor } from './interactors/CreateItemInteractor';
import { ItemRepository } from '../infrastructures/repositories/ItemRepository';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const adminItemsRouter = express.Router();

const prisma = new PrismaClient();
const itemRepository = new ItemRepository(prisma);

const createItemInteractor = new CreateItemInteractor(itemRepository);
const createItemController = new CreateItemController(createItemInteractor);

adminItemsRouter.post(
  '/',
  createItemController.execute.bind(createItemController),
);

export { adminItemsRouter };
