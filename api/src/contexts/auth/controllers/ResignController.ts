import express from 'express';
import { IResignInteractor } from '../usecases/IResignInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';
import { DeleteRes } from '@shared/types/delete';

export class ResignController {
  constructor(private readonly resignInteractor: IResignInteractor) {}

  async execute(
    req: AuthenticatedRequest,
    res: express.Response<DeleteRes['/auth/resign'] | { message: string }>,
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      await this.resignInteractor.execute(req.user.userId);

      return res.status(200).json({
        success: true,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          return res.status(404).json({ message: error.message });
        }
      }

      console.error('Error resigning user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
