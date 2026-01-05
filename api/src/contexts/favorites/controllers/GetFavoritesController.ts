import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetFavoritesInteractor } from '../usecases/IGetFavoritesInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class GetFavoritesController {
  constructor(
    private readonly getFavoritesInteractor: IGetFavoritesInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<Record<string, never>>,
    res: express.Response<GetRes['/favorites'] | { message: string }>,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const result = await this.getFavoritesInteractor.execute(req.user.userId);

      const responseFavorites = result.favorites.map((favorite) => ({
        id: favorite.id,
        userId: favorite.userId,
        itemId: favorite.itemId,
        createdAt: favorite.createdAt,
        item: {
          id: favorite.item.id,
          name: favorite.item.name,
          price: favorite.item.price,
          images: favorite.item.images.map((image) => ({
            id: image.id,
            src: image.src,
            order: image.order,
          })),
        },
      }));

      return res.status(200).json({
        favorites: responseFavorites,
        total: result.total,
      });
    } catch (error: unknown) {
      console.error('Error fetching favorites:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
