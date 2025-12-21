export interface CreateOrderPaymentExternalIdParams {
  orderId: number;
  provider: string;
  paymentSessionId?: string;
  paymentId?: string;
}

export interface CreateOrderPaymentExternalIdResult {
  id: number;
  orderId: number;
  provider: string;
  paymentSessionId: string | null;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrderPaymentExternalIdInteractor {
  execute(
    params: CreateOrderPaymentExternalIdParams,
  ): Promise<CreateOrderPaymentExternalIdResult>;
}
