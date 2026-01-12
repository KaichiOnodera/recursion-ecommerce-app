import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetWishlistsInteractor } from '../usecases/IGetWishlistsInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class GetWishlistsController {
  constructor(
    private readonly getWishlistsInteractor: IGetWishlistsInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<Record<string, never>>,
    res: express.Response<GetRes['/wishlist'] | { message: string }>,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const wishlists = await this.getWishlistsInteractor.execute(
      req.user.userId,
    );

    const responseWishlists = wishlists.map((wishlist) => ({
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    }));

    return res.status(200).json({
      wishlists: responseWishlists,
    });
  }
}
