import express from 'express';
import { IHandleStripeWebhookInteractor } from '../usecases/IHandleStripeWebhookInteractor';
import { IStripeAdapter } from '../domains/adapters/IStripeAdapter';

export class StripeWebhookController {
  constructor(
    private readonly handleStripeWebhookInteractor: IHandleStripeWebhookInteractor,
    private readonly stripeAdapter: IStripeAdapter,
  ) {}

  async execute(
    req: express.Request,
    res: express.Response,
  ): Promise<express.Response> {
    // Stripe署名ヘッダーの確認
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res
        .status(400)
        .json({ message: 'Missing stripe-signature header' });
    }

    if (typeof signature !== 'string') {
      return res
        .status(400)
        .json({ message: 'Invalid stripe-signature header format' });
    }

    // Webhook Secretの確認
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }

    try {
      const event = await this.stripeAdapter.verifyWebhookSignature(
        req.body,
        signature,
        webhookSecret,
      );

      await this.handleStripeWebhookInteractor.execute(event);

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: 'Invalid signature' });
    }
  }
}
