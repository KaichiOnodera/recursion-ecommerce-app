import express from 'express';
import { DeleteRes } from '@shared/types/delete';
import { IRemoveFavoriteInteractor } from '../usecases/IRemoveFavoriteInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class RemoveFavoriteController {
  constructor(
    private readonly removeFavoriteInteractor: IRemoveFavoriteInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<
      Record<string, never>,
      { itemId: string },
      Record<string, never>
    >,
    res: express.Response<
      DeleteRes['/favorites/:itemId'] | { message: string }
    >,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const itemId = parseInt(req.params.itemId);

      if (isNaN(itemId)) {
        return res.status(400).json({
          message: 'Invalid item ID',
        });
      }

      await this.removeFavoriteInteractor.execute(req.user.userId, itemId);

      return res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Favorite not found') {
          return res.status(404).json({ message: error.message });
        }
      }

      console.error('Error removing favorite:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
