import { IGetOrdersInteractor } from '../usecases/IGetOrdersInteractor';
import { IOrderRepository } from '../domains/repositories/IOrderRepository';
import { Order } from '../domains/entities/Order';
import { OrderStatus } from '@prisma/client';

export class GetOrdersInteractor implements IGetOrdersInteractor {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(userId: number): Promise<Order[]> {
    // 購入履歴には、COMPLETED（完了）とSHIPPED（発送済み）のみを表示
    const orders = await this.orderRepository.findByUserId(userId);
    return orders.filter(
      (order) =>
        order.orderStatus === OrderStatus.COMPLETED ||
        order.orderStatus === OrderStatus.SHIPPED,
    );
  }
}
