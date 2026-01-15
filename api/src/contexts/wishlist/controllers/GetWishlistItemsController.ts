import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetWishlistItemsInteractor } from '../usecases/IGetWishlistItemsInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class GetWishlistItemsController {
  constructor(
    private readonly getWishlistItemsInteractor: IGetWishlistItemsInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<
      Record<string, never>,
      { wishlistId: string },
      Record<string, never>
    >,
    res: express.Response<
      GetRes['/wishlist/:wishlistId/items'] | { message: string }
    >,
  ) {
    const wishlistId = parseInt(req.params.wishlistId);

    if (isNaN(wishlistId)) {
      return res.status(400).json({
        message: 'Invalid wishlist ID',
      });
    }

    // 認証されていない場合はuserId: 0を渡す（公開ウィッシュリストのみアクセス可能）
    const userId = req.user?.userId ?? 0;

    try {
      const wishlistItems = await this.getWishlistItemsInteractor.execute(
        wishlistId,
        userId,
      );

      const responseWishlistItems = wishlistItems.map((wishlistItem) => ({
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
          images: wishlistItem.item.images.map((image) => ({
            id: image.id,
            src: image.src,
            order: image.order,
          })),
        },
      }));

      return res.status(200).json({
        items: responseWishlistItems,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Wishlist not found or access denied') {
          return res.status(403).json({ message: error.message });
        }
      }
      throw error;
    }
  }
}
