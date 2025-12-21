import { ICreateOrderInteractor } from '../usecases/ICreateOrderInteractor';
import {
  IOrderRepository,
  CreateOrderData,
  Order,
} from '../domains/repositories/IOrderRepository';

export class CreateOrderInteractor implements ICreateOrderInteractor {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(data: CreateOrderData): Promise<Order> {
    return await this.orderRepository.create(data);
  }
}
