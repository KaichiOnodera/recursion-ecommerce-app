import express from 'express';
import { PatchReq, PatchRes } from '@shared/types/patches';
import { IUpdateWishlistInteractor } from '../usecases/IUpdateWishlistInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class UpdateWishlistController {
  constructor(
    private readonly updateWishlistInteractor: IUpdateWishlistInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<
      PatchReq['/wishlist/:wishlistId'],
      { wishlistId: string },
      Record<string, never>
    >,
    res: express.Response<
      PatchRes['/wishlist/:wishlistId'] | { message: string }
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

    const { name, isPublic } = req.body;

    // 少なくとも1つのフィールドが更新されるか確認
    if (name === undefined && isPublic === undefined) {
      return res.status(400).json({
        message: 'At least one field (name or isPublic) must be provided',
      });
    }

    try {
      const wishlist = await this.updateWishlistInteractor.execute(
        wishlistId,
        name,
        isPublic,
        req.user.userId,
      );

      const responseWishlist = {
        id: wishlist.id,
        userId: wishlist.userId,
        name: wishlist.name,
        isPublic: wishlist.isPublic,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      };

      return res.status(200).json({ wishlist: responseWishlist });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Wishlist not found or access denied') {
          return res.status(403).json({ message: error.message });
        }
        if (error.message === 'Failed to update wishlist') {
          return res.status(404).json({ message: error.message });
        }
      }
      throw error;
    }
  }
}
