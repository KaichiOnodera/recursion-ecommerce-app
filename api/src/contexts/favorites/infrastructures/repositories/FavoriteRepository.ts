import { PrismaClient } from '@prisma/client';
import { IFavoriteRepository } from '../../domains/repositories/IFavoriteRepository';
import { Favorite } from '../../domains/entities/Favorite';

export class FavoriteRepository implements IFavoriteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: number, itemId: number): Promise<Favorite> {
    const favorite = await this.prisma.favorites.create({
      data: {
        userId,
        itemId,
      },
    });

    return {
      id: favorite.id,
      userId: favorite.userId,
      itemId: favorite.itemId,
      createdAt: favorite.createdAt,
      updatedAt: favorite.updatedAt,
    };
  }

  async findByUserIdAndItemId(
    userId: number,
    itemId: number,
  ): Promise<Favorite | null> {
    const favorite = await this.prisma.favorites.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (!favorite) {
      return null;
    }

    return {
      id: favorite.id,
      userId: favorite.userId,
      itemId: favorite.itemId,
      createdAt: favorite.createdAt,
      updatedAt: favorite.updatedAt,
    };
  }

  async delete(userId: number, itemId: number): Promise<void> {
    await this.prisma.favorites.delete({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });
  }
}
