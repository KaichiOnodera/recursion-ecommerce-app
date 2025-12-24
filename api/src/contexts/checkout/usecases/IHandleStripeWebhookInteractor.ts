import Stripe from 'stripe';

export interface IHandleStripeWebhookInteractor {
  execute(event: Stripe.Event): Promise<void>;
}
