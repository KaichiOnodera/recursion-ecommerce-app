import express from 'express';
import { CreateReviewController } from './controllers/CreateReviewController';
import { CreateReviewInteractor } from './interactors/CreateReviewInteractor';
import { ReviewRepository } from './infrastructures/repositories/ReviewRepository';
import { prisma } from '../../libs/prisma';
import { verifyAccessToken } from '../../middlewares';

const reviewsRouter = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const createReviewInteractor = new CreateReviewInteractor(reviewRepository);
const createReviewController = new CreateReviewController(
  createReviewInteractor,
);

reviewsRouter.post(
  '/',
  verifyAccessToken,
  createReviewController.execute.bind(createReviewController),
);

export { reviewsRouter };
