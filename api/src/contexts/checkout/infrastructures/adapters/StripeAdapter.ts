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
    requireEmail?: boolean;
    requireShippingAddress?: boolean;
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

    // メールアドレスの処理
    // ログインユーザーの場合：既知のメールアドレスを設定
    // ゲストユーザーの場合：customer_emailを設定しないことでStripeが自動的にメールアドレスを収集
    if (params.customerEmail) {
      sessionParams.customer_email = params.customerEmail;
    }
    // customerEmailがない場合（ゲストユーザー）、Stripeが自動的にメールアドレス収集フォームを表示します

    // 物理商品がある場合、住所入力を必須にする
    if (params.requireShippingAddress) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ['JP'],
      };
    }

    const session = await this.stripe.checkout.sessions.create(sessionParams);

    return {
      sessionId: session.id,
      checkoutUrl: session.url ?? '',
    };
  }

  async verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
  ): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}
