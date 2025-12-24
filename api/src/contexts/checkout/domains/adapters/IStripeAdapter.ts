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
    secret: string,
  ): Promise<any>;
}
