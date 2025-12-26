import { OrderPaymentExternalId } from '../domains/entities/OrderPaymentExternalId';

export interface UpdateOrderPaymentExternalIdParams {
  paymentSessionId: string;
  paymentId: string;
}

export interface IUpdateOrderPaymentExternalIdInteractor {
  execute(
    params: UpdateOrderPaymentExternalIdParams,
  ): Promise<OrderPaymentExternalId | null>;
}

