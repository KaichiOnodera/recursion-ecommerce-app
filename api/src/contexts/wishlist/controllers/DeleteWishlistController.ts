import express from 'express';
import { DeleteRes } from '@shared/types/delete';
import { IDeleteWishlistInteractor } from '../usecases/IDeleteWishlistInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class DeleteWishlistController {
  constructor(
    private readonly deleteWishlistInteractor: IDeleteWishlistInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<
      Record<string, never>,
      { wishlistId: string },
      Record<string, never>
    >,
    res: express.Response<
      DeleteRes['/wishlist/:wishlistId'] | { message: string }
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

    try {
      await this.deleteWishlistInteractor.execute(wishlistId, req.user.userId);

      return res.status(200).json({
        message: 'Wishlist deleted successfully',
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
