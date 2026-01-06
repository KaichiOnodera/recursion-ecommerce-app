import {
  IUpdateOrderPaymentExternalIdInteractor,
  UpdateOrderPaymentExternalIdParams,
} from '../usecases/IUpdateOrderPaymentExternalIdInteractor';
import { IOrderRepository } from '../domains/repositories/IOrderRepository';
import { OrderPaymentExternalId } from '../domains/entities/OrderPaymentExternalId';

export class UpdateOrderPaymentExternalIdInteractor
  implements IUpdateOrderPaymentExternalIdInteractor
{
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(
    params: UpdateOrderPaymentExternalIdParams,
  ): Promise<OrderPaymentExternalId | null> {
    return await this.orderRepository.updatePaymentExternalIdBySessionId(
      params.paymentSessionId,
      params.paymentId,
    );
  }
}
