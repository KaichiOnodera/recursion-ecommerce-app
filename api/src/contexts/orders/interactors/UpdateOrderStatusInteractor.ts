import { IUpdateOrderStatusInteractor } from '../usecases/IUpdateOrderStatusInteractor';
import { IOrderRepository } from '../domains/repositories/IOrderRepository';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusInteractor
  implements IUpdateOrderStatusInteractor
{
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: number, status: OrderStatus) {
    return await this.orderRepository.updateStatus(id, status);
  }
}
