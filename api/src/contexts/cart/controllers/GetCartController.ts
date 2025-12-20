import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';

export class GetCartController {
  constructor(private readonly getCartInteractor: IGetCartInteractor) {}

  async execute(
    req: AuthenticatedRequest,
    res: express.Response<GetRes['/cart'] | { message: string }>,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
      const cart = await this.getCartInteractor.execute(
        Number(req.user.userId),
      );

      if (!cart) {
        res.status(200).json({ items: [] });
        return;
      }

      // displayStatusを除外してCartItem形式に変換
      const items = cart.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type,
        price: item.price,
        amount: item.amount,
      }));

      return res.status(200).json({ items });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to retrieve cart' });
    }
  }
}
