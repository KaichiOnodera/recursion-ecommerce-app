export type ItemStripeMapping = {
  readonly id: number;
  readonly itemId: number;
  readonly stripeProductId: string;
  readonly stripePriceId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
