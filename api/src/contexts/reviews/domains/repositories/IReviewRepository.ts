import { Review } from '../entities/Review';

export interface IReviewRepository {
  create(
    userId: number,
    itemId: number,
    title: string | null,
    body: string,
    rating: number,
  ): Promise<Review>;
  findByUserIdAndItemId(userId: number, itemId: number): Promise<Review | null>;
}
