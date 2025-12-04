import express from 'express';
import { PostReq, PostRes } from '@shared/types/posts';
import { ICartInteractor } from '../usecases/ICartInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccesToken';

export class CartController {
  constructor(private readonly cartInteractor: ICartInteractor) {}

  async execute(
    req: AuthenticatedRequest<PostReq['/cart']>,
    res: express.Response<PostRes['/cart'] | { message: string }>,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    for (const item of items) {
      if (typeof item.id !== 'number' || typeof item.amount !== 'number') {
        return res
          .status(400)
          .json({ message: 'Each item must have id and amount as numbers' });
      }
      if (item.amount < 0) {
        return res.status(400).json({ message: 'Amount must be non-negative' });
      }
    }

    const cart = await this.cartInteractor.execute(req.user.userId, items);

    res.status(200).json({ items: cart.items });
  }
}
