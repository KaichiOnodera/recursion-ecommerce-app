import express from 'express';
import { PostReq, PostRes } from '@shared/types/posts';
import { ICreateWishlistInteractor } from '../usecases/ICreateWishlistInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class CreateWishlistController {
  constructor(
    private readonly createWishlistInteractor: ICreateWishlistInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<PostReq['/wishlist']>,
    res: express.Response<PostRes['/wishlist'] | { message: string }>,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, isPublic } = req.body;

    const wishlist = await this.createWishlistInteractor.execute(
      req.user.userId,
      name ?? null,
      isPublic ?? false,
    );

    const responseWishlist = {
      id: wishlist.id,
      userId: wishlist.userId,
      name: wishlist.name,
      isPublic: wishlist.isPublic,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };

    return res.status(201).json({ wishlist: responseWishlist });
  }
}
