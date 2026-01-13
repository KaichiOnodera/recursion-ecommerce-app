import express from 'express';
import { DeleteRes } from '@shared/types/delete';
import { IRemoveWishlistItemInteractor } from '../usecases/IRemoveWishlistItemInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class RemoveWishlistItemController {
  constructor(
    private readonly removeWishlistItemInteractor: IRemoveWishlistItemInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<
      Record<string, never>,
      { wishlistId: string; itemId: string },
      Record<string, never>
    >,
    res: express.Response<
      DeleteRes['/wishlist/:wishlistId/items/:itemId'] | { message: string }
    >,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const wishlistId = parseInt(req.params.wishlistId);
    const itemId = parseInt(req.params.itemId);

    if (isNaN(wishlistId)) {
      return res.status(400).json({
        message: 'Invalid wishlist ID',
      });
    }

    if (isNaN(itemId)) {
      return res.status(400).json({
        message: 'Invalid item ID',
      });
    }

    try {
      await this.removeWishlistItemInteractor.execute(
        wishlistId,
        itemId,
        req.user.userId,
      );

      return res.status(200).json({
        message: 'Wishlist item removed successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Wishlist item not found') {
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
