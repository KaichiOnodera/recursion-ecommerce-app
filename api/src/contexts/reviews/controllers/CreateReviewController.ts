import express from 'express';
import { PostReq, PostRes } from '@shared/types/posts';
import { ICreateReviewInteractor } from '../usecases/ICreateReviewInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class CreateReviewController {
  constructor(
    private readonly createReviewInteractor: ICreateReviewInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<PostReq['/reviews']>,
    res: express.Response<PostRes['/reviews'] | { message: string }>,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { itemId, title, body, rating } = req.body;

      if (!itemId || !body || rating === undefined) {
        return res.status(400).json({
          message: 'itemId, body, and rating are required',
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: 'Rating must be between 1 and 5',
        });
      }

      const review = await this.createReviewInteractor.execute(
        req.user.userId,
        itemId,
        title ?? null,
        body,
        rating,
      );

      const responseReview = {
        id: review.id,
        userId: review.userId,
        itemId: review.itemId,
        title: review.title,
        body: review.body,
        rating: review.rating,
        postedAt: review.postedAt,
      };

      return res.status(201).json({ review: responseReview });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Review already exists for this item') {
          return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Rating must be between 1 and 5') {
          return res.status(400).json({ message: error.message });
        }
      }

      console.error('Error creating review:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
