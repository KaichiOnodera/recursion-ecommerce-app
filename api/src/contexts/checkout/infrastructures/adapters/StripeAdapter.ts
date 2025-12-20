import Stripe from 'stripe';
import { IStripeAdapter } from '../../domains/adapters/IStripeAdapter';
import {
  CheckoutSession,
  CheckoutSessionMode,
} from '../../domains/entities/CheckoutSession';

export class StripeAdapter implements IStripeAdapter {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createCheckoutSession(params: {
    lineItems: Array<{
      priceData?: {
        currency: string;
        productData: {
          name: string;
          description?: string;
        };
        unitAmount: number;
      };
      quantity: number;
    }>;
    mode: CheckoutSessionMode;
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
  }): Promise<CheckoutSession> {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: params.mode,
      line_items: params.lineItems.map((item) => ({
        price_data: {
          currency: item.priceData?.currency ?? 'jpy',
          product_data: {
            name: item.priceData?.productData.name ?? '',
            description: item.priceData?.productData.description,
          },
          unit_amount: item.priceData?.unitAmount ?? 0,
        },
        quantity: item.quantity,
      })),
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    };

    if (params.customerEmail) {
      sessionParams.customer_email = params.customerEmail;
    }

    const session = await this.stripe.checkout.sessions.create(sessionParams);

    return {
      sessionId: session.id,
      checkoutUrl: session.url ?? '',
    };
  }
}
