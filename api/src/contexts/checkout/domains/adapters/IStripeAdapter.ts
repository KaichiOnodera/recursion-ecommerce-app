import { CheckoutSession } from '../entities/CheckoutSession';

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
    mode: 'payment' | 'subscription';
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
  }): Promise<CheckoutSession>;
}
