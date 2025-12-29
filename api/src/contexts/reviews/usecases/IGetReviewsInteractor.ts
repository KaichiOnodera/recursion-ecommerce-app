import {
  FindReviewsParams,
  FindReviewsResult,
} from '../domains/repositories/IReviewRepository';

export interface IGetReviewsInteractor {
  execute(
    itemId: number,
    params?: FindReviewsParams,
  ): Promise<FindReviewsResult>;
}
