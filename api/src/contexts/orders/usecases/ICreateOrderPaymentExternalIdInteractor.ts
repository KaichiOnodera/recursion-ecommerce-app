import { OrderPaymentExternalId } from '../domains/entities/OrderPaymentExternalId';

export interface CreateOrderPaymentExternalIdParams {
  orderId: number;
  provider: string;
  paymentSessionId?: string;
  paymentId?: string;
}

export interface ICreateOrderPaymentExternalIdInteractor {
  execute(
    params: CreateOrderPaymentExternalIdParams,
  ): Promise<OrderPaymentExternalId>;
}
