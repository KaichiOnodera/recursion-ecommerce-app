import { Review } from '../entities/Review';

export interface FindReviewsParams {
  page?: number;
  limit?: number;
}

export interface FindReviewsResult {
  reviews: Review[];
  total: number;
}

export interface IReviewRepository {
  create(
    userId: number,
    itemId: number,
    title: string | null,
    body: string,
    rating: number,
  ): Promise<Review>;
  findByUserIdAndItemId(userId: number, itemId: number): Promise<Review | null>;
  findByItemId(
    itemId: number,
    params?: FindReviewsParams,
  ): Promise<FindReviewsResult>;
}
