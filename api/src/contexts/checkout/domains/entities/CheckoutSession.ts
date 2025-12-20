export const CheckoutSessionMode = {
  Payment: 'payment',
} as const;

export type CheckoutSessionMode = 'payment';

export type CheckoutSession = {
  sessionId: string;
  checkoutUrl: string;
};
