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

    try {
      const event = await this.stripeAdapter.verifyWebhookSignature(
        req.body,
        signature,
      );

      await this.handleStripeWebhookInteractor.execute(event);

      return res.status(200).json({ received: true });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = req.body as any;
      if (error instanceof Error) {
        return res.status(400).json({
          message: error.message,
          eventType: body?.type,
        });
      }
      return res.status(400).json({
        message: 'Webhook processing failed',
        eventType: body?.type,
      });
    }
  }
}
