export type OrderPaymentExternalId = {
  readonly id: number;
  readonly orderId: number;
  readonly provider: string;
  readonly paymentSessionId: string | null;
  readonly paymentId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
