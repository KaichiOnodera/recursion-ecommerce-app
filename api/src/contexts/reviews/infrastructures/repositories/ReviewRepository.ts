import { PrismaClient } from '@prisma/client';
import {
  IReviewRepository,
  FindReviewsParams,
  FindReviewsResult,
} from '../../domains/repositories/IReviewRepository';
import { Review } from '../../domains/entities/Review';

export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    userId: number,
    itemId: number,
    title: string | null,
    body: string,
    rating: number,
  ): Promise<Review> {
    const review = await this.prisma.reviews.create({
      data: {
        userId,
        itemId,
        title,
        body,
        rating,
      },
    });

    return {
      id: review.id,
      userId: review.userId,
      itemId: review.itemId,
      title: review.title,
      body: review.body,
      rating: review.rating,
      postedAt: review.postedAt,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async findByUserIdAndItemId(
    userId: number,
    itemId: number,
  ): Promise<Review | null> {
    const review = await this.prisma.reviews.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (!review) {
      return null;
    }

    return {
      id: review.id,
      userId: review.userId,
      itemId: review.itemId,
      title: review.title,
      body: review.body,
      rating: review.rating,
      postedAt: review.postedAt,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async findByItemId(
    itemId: number,
    params?: FindReviewsParams,
  ): Promise<FindReviewsResult> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.reviews.findMany({
        where: {
          itemId,
        },
        orderBy: {
          postedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.reviews.count({
        where: {
          itemId,
        },
      }),
    ]);

    return {
      reviews: reviews.map((review) => ({
        id: review.id,
        userId: review.userId,
        itemId: review.itemId,
        title: review.title,
        body: review.body,
        rating: review.rating,
        postedAt: review.postedAt,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      total,
    };
  }
}
