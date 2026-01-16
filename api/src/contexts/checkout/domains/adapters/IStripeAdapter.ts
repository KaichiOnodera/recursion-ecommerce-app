import Stripe from 'stripe';
import {
  CheckoutSession,
  CheckoutSessionMode,
} from '../entities/CheckoutSession';

export interface IStripeAdapter {
  // Checkout Sessionを作成
  createCheckoutSession(params: {
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
  }): Promise<CheckoutSession>;

  // Webhook署名を検証
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
  ): Promise<Stripe.Event>;

  // Checkout Sessionを取得
  retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session>;

  // 製品管理メソッド
  deleteProduct(productId: string): Promise<void>;
  retrieveProduct(productId: string): Promise<Stripe.Product>;
  retrievePrice(priceId: string): Promise<Stripe.Price>;
  listPrices(productId: string): Promise<Stripe.ApiList<Stripe.Price>>;
}
