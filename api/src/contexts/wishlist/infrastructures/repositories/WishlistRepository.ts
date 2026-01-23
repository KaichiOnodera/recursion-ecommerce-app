import { PrismaClient } from '@prisma/client';
import { IWishlistRepository } from '../../domains/repositories/IWishlistRepository';
import { Wishlist } from '../../domains/entities/Wishlist';
import {
  WishlistItem,
  WishlistItemWithItem,
  ItemImage,
} from '../../domains/entities/WishlistItem';
import { IItemImageRepository } from '../../../items/domains/repositories/IItemImageRepository';
import { IImageStorageAdapter } from '../../../items/domains/adapters/IImageStorageAdapter';

export class WishlistRepository implements IWishlistRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly itemImageRepository: IItemImageRepository,
    private readonly imageStorageAdapter: IImageStorageAdapter,
  ) {}

  async findWishlistsByUserId(userId: number): Promise<Wishlist[]> {
    const wishlists = await this.prisma.wishlist.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return wishlists.map((wishlist) => ({
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    }));
  }

  async findWishlistByIdAndUserId(
    wishlistId: number,
    userId: number,
  ): Promise<Wishlist | null> {
    const wishlist = await this.prisma.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId,
      },
    });

    if (!wishlist) {
      return null;
    }

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }

  async findPublicWishlistById(
    wishlistId: number,
    userId: number,
  ): Promise<Wishlist | null> {
    const wishlist = await this.prisma.wishlist.findFirst({
      where: {
        id: wishlistId,
        userId,
        isPublic: true,
      },
    });

    if (!wishlist) {
      return null;
    }

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }

  async findPublicWishlistByIdOnly(
    wishlistId: number,
  ): Promise<Wishlist | null> {
    const wishlist = await this.prisma.wishlist.findFirst({
      where: {
        id: wishlistId,
        isPublic: true,
      },
    });

    if (!wishlist) {
      return null;
    }

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }

  async createWishlist(
    userId: number,
    name: string | null,
    isPublic: boolean,
  ): Promise<Wishlist> {
    const wishlist = await this.prisma.wishlist.create({
      data: {
        userId,
        name,
        isPublic,
      },
    });

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }

  async updateWishlist(
    wishlistId: number,
    name: string | null | undefined,
    isPublic: boolean | undefined,
  ): Promise<Wishlist | null> {
    const updateData: {
      name?: string | null;
      isPublic?: boolean;
    } = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (isPublic !== undefined) {
      updateData.isPublic = isPublic;
    }

    const wishlist = await this.prisma.wishlist.update({
      where: {
        id: wishlistId,
      },
      data: updateData,
    });

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }

  async deleteWishlist(wishlistId: number): Promise<void> {
    await this.prisma.wishlist.delete({
      where: {
        id: wishlistId,
      },
    });
  }

  async findWishlistItemsByWishlistId(
    wishlistId: number,
  ): Promise<WishlistItemWithItem[]> {
    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: {
        wishlistId,
      },
      include: {
        item: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const wishlistItemsWithItems: WishlistItemWithItem[] = await Promise.all(
      wishlistItems.map(async (wishlistItem): Promise<WishlistItemWithItem> => {
        // 画像情報を取得してURLに変換
        const images = await this.itemImageRepository.findByItemId(
          wishlistItem.itemId,
        );
        const imagesWithUrl: ItemImage[] = images.map((image) => ({
          id: image.id,
          src: this.imageStorageAdapter.getUrl(image.src, wishlistItem.itemId),
          order: image.order,
        }));

        return {
          id: wishlistItem.id,
          wishlistId: wishlistItem.wishlistId,
          itemId: wishlistItem.itemId,
          createdAt: wishlistItem.createdAt,
          updatedAt: wishlistItem.updatedAt,
          item: {
            id: wishlistItem.item.id,
            name: wishlistItem.item.name,
            description: wishlistItem.item.description,
            price: wishlistItem.item.price,
            images: imagesWithUrl,
          },
        };
      }),
    );

    return wishlistItemsWithItems;
  }

  async addWishlistItem(
    wishlistId: number,
    itemId: number,
  ): Promise<WishlistItem> {
    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        wishlistId,
        itemId,
      },
    });

    return {
      id: wishlistItem.id,
      wishlistId: wishlistItem.wishlistId,
      itemId: wishlistItem.itemId,
      createdAt: wishlistItem.createdAt,
      updatedAt: wishlistItem.updatedAt,
    };
  }

  async removeWishlistItem(wishlistId: number, itemId: number): Promise<void> {
    await this.prisma.wishlistItem.delete({
      where: {
        wishlistId_itemId: {
          wishlistId,
          itemId,
        },
      },
    });
  }

  async existsWishlistItem(
    wishlistId: number,
    itemId: number,
  ): Promise<boolean> {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_itemId: {
          wishlistId,
          itemId,
        },
      },
    });

    return wishlistItem !== null;
  }
}
