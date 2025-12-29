import { Review } from '../domains/entities/Review';

export interface IGetReviewsInteractor {
  execute(itemId: number): Promise<Review[]>;
}
