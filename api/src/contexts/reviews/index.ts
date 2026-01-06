import express from 'express';
import { CreateReviewController } from './controllers/CreateReviewController';
import { GetReviewsController } from './controllers/GetReviewsController';
import { CreateReviewInteractor } from './interactors/CreateReviewInteractor';
import { GetReviewsInteractor } from './interactors/GetReviewsInteractor';
import { ReviewRepository } from './infrastructures/repositories/ReviewRepository';
import { prisma } from '../../libs/prisma';
import { verifyAccessToken } from '../../middlewares';

const reviewsRouter = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const createReviewInteractor = new CreateReviewInteractor(reviewRepository);
const getReviewsInteractor = new GetReviewsInteractor(reviewRepository);
const createReviewController = new CreateReviewController(
  createReviewInteractor,
);
const getReviewsController = new GetReviewsController(getReviewsInteractor);

reviewsRouter.get(
  '/items/:itemId',
  getReviewsController.execute.bind(getReviewsController),
);

reviewsRouter.post(
  '/',
  verifyAccessToken,
  createReviewController.execute.bind(createReviewController),
);

export { reviewsRouter };
