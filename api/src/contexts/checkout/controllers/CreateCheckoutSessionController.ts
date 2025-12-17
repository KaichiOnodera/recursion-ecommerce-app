import express from 'express';
import { ICreateCheckoutSessionInteractor } from '../usecases/ICreateCheckoutSessionInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccesToken';

export class CreateCheckoutSessionController {
  constructor(
    private readonly createCheckoutSessionInteractor: ICreateCheckoutSessionInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<Record<string, never>, Record<string, never>>,
    res: express.Response<
      { sessionId: string; url: string } | { message: string }
    >,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const successUrl =
      process.env.CHECKOUT_SUCCESS_URL ??
      'http://localhost:3000/order/complete';
    const cancelUrl =
      process.env.CHECKOUT_CANCEL_URL ?? 'http://localhost:3000/products';

    try {
      const result = await this.createCheckoutSessionInteractor.execute({
        userId: req.user.userId,
        successUrl,
        cancelUrl,
      });

      return res.status(200).json(result);
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
