import express from 'express';
import { PostReq, PostRes } from '@shared/types/posts';
import { IAddWishlistItemInteractor } from '../usecases/IAddWishlistItemInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class AddWishlistItemController {
  constructor(
    private readonly addWishlistItemInteractor: IAddWishlistItemInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<
      PostReq['/wishlist/:wishlistId/items'],
      { wishlistId: string },
      Record<string, never>
    >,
    res: express.Response<
      PostRes['/wishlist/:wishlistId/items'] | { message: string }
    >,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const wishlistId = parseInt(req.params.wishlistId);

    if (isNaN(wishlistId)) {
      return res.status(400).json({
        message: 'Invalid wishlist ID',
      });
    }

    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        message: 'itemId is required',
      });
    }

    try {
      const wishlistItem = await this.addWishlistItemInteractor.execute(
        wishlistId,
        itemId,
        req.user.userId,
      );

      const responseWishlistItem = {
        id: wishlistItem.id,
        wishlistId: wishlistItem.wishlistId,
        itemId: wishlistItem.itemId,
        createdAt: wishlistItem.createdAt,
        updatedAt: wishlistItem.updatedAt,
      };

      return res.status(201).json({ wishlistItem: responseWishlistItem });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Item already exists in wishlist') {
          return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Item not found') {
          return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Wishlist not found or access denied') {
          return res.status(403).json({ message: error.message });
        }
      }
      throw error;
    }
  }
}
