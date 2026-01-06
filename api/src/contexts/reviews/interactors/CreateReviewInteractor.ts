import { ICreateReviewInteractor } from '../usecases/ICreateReviewInteractor';
import { IReviewRepository } from '../domains/repositories/IReviewRepository';
import { Review } from '../domains/entities/Review';

export class CreateReviewInteractor implements ICreateReviewInteractor {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(
    userId: number,
    itemId: number,
    title: string | null,
    body: string,
    rating: number,
  ): Promise<Review> {
    // 既存のレビューをチェック
    const existingReview = await this.reviewRepository.findByUserIdAndItemId(
      userId,
      itemId,
    );

    if (existingReview) {
      throw new Error('Review already exists for this item');
    }

    // レーティングのバリデーション
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return await this.reviewRepository.create(
      userId,
      itemId,
      title,
      body,
      rating,
    );
  }
}
