import {
  ICreateOrderPaymentExternalIdInteractor,
  CreateOrderPaymentExternalIdParams,
} from '../usecases/ICreateOrderPaymentExternalIdInteractor';
import { IOrderRepository } from '../domains/repositories/IOrderRepository';
import { OrderPaymentExternalId } from '../domains/entities/OrderPaymentExternalId';

export class CreateOrderPaymentExternalIdInteractor
  implements ICreateOrderPaymentExternalIdInteractor
{
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(
    params: CreateOrderPaymentExternalIdParams,
  ): Promise<OrderPaymentExternalId> {
    return await this.orderRepository.createPaymentExternalId({
      orderId: params.orderId,
      provider: params.provider,
      paymentSessionId: params.paymentSessionId,
      paymentId: params.paymentId,
    });
  }
}
