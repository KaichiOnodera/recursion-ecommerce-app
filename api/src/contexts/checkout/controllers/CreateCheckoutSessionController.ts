import express from 'express';
import { ICreateCheckoutSessionInteractor } from '../usecases/ICreateCheckoutSessionInteractor';
import { AuthenticatedRequest } from '../../../middlewares';
import { PostRes } from '@shared/types/posts';
import { getCartSessionIdFromCookie } from '../../../utils/cookie';

export class CreateCheckoutSessionController {
  constructor(
    private readonly createCheckoutSessionInteractor: ICreateCheckoutSessionInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<Record<string, never>, Record<string, never>>,
    res: express.Response<PostRes['/checkout/session'] | { message: string }>,
  ) {
    try {
      // ログインユーザーの場合: userIdを使用
      // ゲストユーザーの場合: sessionIdを使用
      const sessionId = getCartSessionIdFromCookie(req);

      if (req.user) {
        const result = await this.createCheckoutSessionInteractor.execute({
          userId: req.user.userId,
        });
        return res.status(200).json(result);
      } else if (sessionId) {
        const result = await this.createCheckoutSessionInteractor.execute({
          sessionId,
        });
        return res.status(200).json(result);
      } else {
        return res.status(400).json({
          message: 'Cart session not found. Please add items to cart first.',
        });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      if (error instanceof Error) {
        if (error.message === 'Cart is empty') {
          return res.status(400).json({ message: error.message });
        }
        if (error.message.includes('Insufficient inventory')) {
          return res.status(400).json({ message: error.message });
        }
        if (error.message === 'User not found') {
          return res.status(404).json({ message: error.message });
        }
        if (error.message.includes('not found')) {
          return res.status(404).json({ message: error.message });
        }
      }
      throw error;
    }
  }
}
