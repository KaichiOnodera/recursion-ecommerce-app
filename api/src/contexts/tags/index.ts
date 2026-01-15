import { GetTagsController } from './controllers/GetTagsController';
import { GetTagsInteractor } from './interactors/GetTagsInteractor';
import { TagRepository } from './infrastructures/repositories/TagRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';

const tagsRouter = express.Router();

const tagRepository = new TagRepository(prisma);
const getTagsInteractor = new GetTagsInteractor(tagRepository);
const getTagsController = new GetTagsController(getTagsInteractor);

tagsRouter.get('/', getTagsController.execute.bind(getTagsController));

export { tagsRouter };
