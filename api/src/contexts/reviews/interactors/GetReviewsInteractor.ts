import { IGetReviewsInteractor } from '../usecases/IGetReviewsInteractor';
import { IReviewRepository } from '../domains/repositories/IReviewRepository';
import { Review } from '../domains/entities/Review';

export class GetReviewsInteractor implements IGetReviewsInteractor {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(itemId: number): Promise<Review[]> {
    return await this.reviewRepository.findByItemId(itemId);
  }
}
