import { CreateTagController } from './controllers/CreateTagController';
import { CreateTagInteractor } from './interactors/CreateTagInteractor';
import { GetTagsController } from './controllers/GetTagsController';
import { GetTagsInteractor } from './interactors/GetTagsInteractor';
import { UpdateTagController } from './controllers/UpdateTagController';
import { UpdateTagInteractor } from './interactors/UpdateTagInteractor';
import { DeleteTagController } from './controllers/DeleteTagController';
import { DeleteTagInteractor } from './interactors/DeleteTagInteractor';
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

const updateTagInteractor = new UpdateTagInteractor(tagRepository);
const updateTagController = new UpdateTagController(updateTagInteractor);

const deleteTagInteractor = new DeleteTagInteractor(tagRepository);
const deleteTagController = new DeleteTagController(deleteTagInteractor);

adminTagsRouter.use(verifyAccessToken);
adminTagsRouter.use(verifyAdmin);

adminTagsRouter.get('/', getTagsController.execute.bind(getTagsController));

adminTagsRouter.post(
  '/',
  createTagController.execute.bind(createTagController),
);

adminTagsRouter.patch(
  '/:id',
  updateTagController.execute.bind(updateTagController),
);

adminTagsRouter.delete(
  '/:id',
  deleteTagController.execute.bind(deleteTagController),
);

export { adminTagsRouter };
