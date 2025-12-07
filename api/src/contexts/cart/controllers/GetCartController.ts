import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccesToken';

export class GetCartController {
  constructor(private readonly getcartInteractor: IGetCartInteractor) {}

  async execute(
    req: AuthenticatedRequest,
    res: express.Response<GetRes['/cart'] | { message: string }>,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const cart = await this.getcartInteractor.execute(
        Number(req.user.userId),
      );

      if (!cart) {
        res.status(402).json({ message: 'Cart not found' });
        return null;
      }

      return res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to retrieve cart' });
    }
  }
}
