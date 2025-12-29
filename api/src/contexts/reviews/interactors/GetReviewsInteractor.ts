import { IGetReviewsInteractor } from '../usecases/IGetReviewsInteractor';
import {
  IReviewRepository,
  FindReviewsParams,
  FindReviewsResult,
} from '../domains/repositories/IReviewRepository';

export class GetReviewsInteractor implements IGetReviewsInteractor {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(
    itemId: number,
    params?: FindReviewsParams,
  ): Promise<FindReviewsResult> {
    return await this.reviewRepository.findByItemId(itemId, params);
  }
}
