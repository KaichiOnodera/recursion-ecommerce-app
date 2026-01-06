import { Review } from '../domains/entities/Review';

export interface ICreateReviewInteractor {
  execute(
    userId: number,
    itemId: number,
    title: string | null,
    body: string,
    rating: number,
  ): Promise<Review>;
}
