import { PrismaClient } from '@prisma/client';
import {
  IFavoriteRepository,
  FindFavoritesResult,
} from '../../domains/repositories/IFavoriteRepository';
import { Favorite } from '../../domains/entities/Favorite';
import { FavoriteItem, ItemImage } from '../../domains/entities/FavoriteItem';
import { IItemImageRepository } from '../../../items/domains/repositories/IItemImageRepository';
import { IImageStorageAdapter } from '../../../items/domains/adapters/IImageStorageAdapter';

export class FavoriteRepository implements IFavoriteRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly itemImageRepository: IItemImageRepository,
    private readonly imageStorageAdapter: IImageStorageAdapter,
  ) {}

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

  async findByUserId(userId: number): Promise<FindFavoritesResult> {
    const [favorites, total] = await Promise.all([
      this.prisma.favorites.findMany({
        where: {
          userId,
        },
        include: {
          item: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.favorites.count({
        where: {
          userId,
        },
      }),
    ]);

    const favoritesWithItems: FavoriteItem[] = await Promise.all(
      favorites.map(async (favorite): Promise<FavoriteItem> => {
        // 画像情報を取得してURLに変換
        const images = await this.itemImageRepository.findByItemId(
          favorite.itemId,
        );
        const imagesWithUrl: ItemImage[] = images.map((image) => ({
          id: image.id,
          src: this.imageStorageAdapter.getUrl(image.src, favorite.itemId),
          order: image.order,
        }));

        return {
          id: favorite.id,
          userId: favorite.userId,
          itemId: favorite.itemId,
          createdAt: favorite.createdAt,
          updatedAt: favorite.updatedAt,
          item: {
            id: favorite.item.id,
            name: favorite.item.name,
            price: favorite.item.price,
            images: imagesWithUrl,
          },
        };
      }),
    );

    return {
      favorites: favoritesWithItems,
      total,
    };
  }
}
