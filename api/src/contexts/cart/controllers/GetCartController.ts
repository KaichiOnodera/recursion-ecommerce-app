import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';
import { getCartSessionIdFromCookie } from '../../../utils/cookie';

export class GetCartController {
  constructor(private readonly getCartInteractor: IGetCartInteractor) {}

  async execute(
    req: AuthenticatedRequest,
    res: express.Response<GetRes['/cart'] | { message: string }>,
  ) {
    try {
      let cart;

      if (req.user) {
        cart = await this.getCartInteractor.execute(
          Number(req.user.userId),
          undefined,
        );
      } else {
        const sessionId = getCartSessionIdFromCookie(req);

        if (sessionId) {
          cart = await this.getCartInteractor.execute(undefined, sessionId);
        }
      }

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
