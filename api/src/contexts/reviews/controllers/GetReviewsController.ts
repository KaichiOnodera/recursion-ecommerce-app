import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetReviewsInteractor } from '../usecases/IGetReviewsInteractor';

export class GetReviewsController {
  constructor(private readonly getReviewsInteractor: IGetReviewsInteractor) {}

  async execute(
    req: express.Request<{ itemId: string }>,
    res: express.Response<
      GetRes['/reviews/items/:itemId'] | { message: string }
    >,
  ) {
    try {
      const itemId = parseInt(req.params.itemId);

      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }

      const reviews = await this.getReviewsInteractor.execute(itemId);

      const responseReviews = reviews.map((review) => ({
        id: review.id,
        userId: review.userId,
        itemId: review.itemId,
        title: review.title,
        body: review.body,
        rating: review.rating,
        postedAt: review.postedAt,
      }));

      return res.status(200).json({ reviews: responseReviews });
    } catch (error: unknown) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
