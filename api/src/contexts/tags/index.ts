import { CreateTagController } from './controllers/CreateTagController';
import { CreateTagInteractor } from './interactors/CreateTagInteractor';
import { GetTagsController } from './controllers/GetTagsController';
import { GetTagsInteractor } from './interactors/GetTagsInteractor';
import { TagRepository } from './infrastructures/repositories/TagRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken, verifyAdmin } from '../../middlewares';

const adminTagsRouter = express.Router();

const tagRepository = new TagRepository(prisma);

const createTagInteractor = new CreateTagInteractor(tagRepository);
const createTagController = new CreateTagController(createTagInteractor);

const getTagsInteractor = new GetTagsInteractor(tagRepository);
const getTagsController = new GetTagsController(getTagsInteractor);

adminTagsRouter.use(verifyAccessToken);
adminTagsRouter.use(verifyAdmin);

adminTagsRouter.get('/', getTagsController.execute.bind(getTagsController));

adminTagsRouter.post(
  '/',
  createTagController.execute.bind(createTagController),
);

export { adminTagsRouter };
