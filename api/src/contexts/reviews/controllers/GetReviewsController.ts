import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetReviewsInteractor } from '../usecases/IGetReviewsInteractor';
import { FindReviewsParams } from '../domains/repositories/IReviewRepository';

export class GetReviewsController {
  constructor(private readonly getReviewsInteractor: IGetReviewsInteractor) {}

  async execute(
    req: express.Request<
      { itemId: string },
      unknown,
      unknown,
      { page?: string; limit?: string }
    >,
    res: express.Response<
      GetRes['/reviews/items/:itemId'] | { message: string }
    >,
  ) {
    try {
      const itemId = parseInt(req.params.itemId);

      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }

      const params: FindReviewsParams = {};
      if (req.query.page) {
        const page = parseInt(req.query.page);
        if (!isNaN(page) && page > 0) {
          params.page = page;
        } else {
          return res.status(400).json({ message: 'Invalid page parameter' });
        }
      }
      if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        if (!isNaN(limit) && limit > 0) {
          params.limit = limit;
        } else {
          return res.status(400).json({ message: 'Invalid limit parameter' });
        }
      }

      const result = await this.getReviewsInteractor.execute(itemId, params);

      const responseReviews = result.reviews.map((review) => ({
        id: review.id,
        userId: review.userId,
        itemId: review.itemId,
        title: review.title,
        body: review.body,
        rating: review.rating,
        postedAt: review.postedAt,
      }));

      return res.status(200).json({
        reviews: responseReviews,
        total: result.total,
      });
    } catch (error: unknown) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
