import { IGetOrdersInteractor } from '../usecases/IGetOrdersInteractor';
import { IOrderRepository } from '../../domains/repositories/IOrderRepository';
import { Order } from '../../domains/entities/Order';

export class GetOrdersInteractor implements IGetOrdersInteractor {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}
