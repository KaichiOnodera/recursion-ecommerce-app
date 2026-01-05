import express from 'express';
import { PostReq, PostRes } from '@shared/types/posts';
import { IAddFavoriteInteractor } from '../usecases/IAddFavoriteInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class AddFavoriteController {
  constructor(private readonly addFavoriteInteractor: IAddFavoriteInteractor) {}

  async execute(
    req: AuthenticatedRequest<PostReq['/favorites']>,
    res: express.Response<PostRes['/favorites'] | { message: string }>,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { itemId } = req.body;

      if (!itemId) {
        return res.status(400).json({
          message: 'itemId is required',
        });
      }

      const favorite = await this.addFavoriteInteractor.execute(
        req.user.userId,
        itemId,
      );

      const responseFavorite = {
        id: favorite.id,
        userId: favorite.userId,
        itemId: favorite.itemId,
        createdAt: favorite.createdAt,
      };

      return res.status(201).json({ favorite: responseFavorite });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Favorite already exists for this item') {
          return res.status(409).json({ message: error.message });
        }
        if (error.message === 'Item not found') {
          return res.status(404).json({ message: error.message });
        }
      }

      console.error('Error adding favorite:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
