import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetMeInteractor } from '../usecases/IGetMeInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';

export class MeController {
  constructor(private readonly getMeInteractor: IGetMeInteractor) {}

  async execute(
    req: AuthenticatedRequest,
    res: express.Response<GetRes['/auth/me'] | { message: string }>,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await this.getMeInteractor.execute(req.user.userId);

    res.status(200).json({
      user: {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  }
}
