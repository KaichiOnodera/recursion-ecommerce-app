import { IGetOrdersNeedingShippingInteractor } from '../usecases/IGetOrdersNeedingShippingInteractor';
import { IOrderRepository } from '../../domains/repositories/IOrderRepository';
import { Order } from '../../domains/entities/Order';

export class GetOrdersNeedingShippingInteractor
  implements IGetOrdersNeedingShippingInteractor
{
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return await this.orderRepository.findOrdersNeedingShipping();
  }
}
