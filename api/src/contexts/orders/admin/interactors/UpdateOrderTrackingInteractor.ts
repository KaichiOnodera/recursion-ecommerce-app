import { IUpdateOrderTrackingInteractor } from '../usecases/IUpdateOrderTrackingInteractor';
import { IOrderRepository } from '../../domains/repositories/IOrderRepository';
import { prisma } from '../../../../libs/prisma';
import { Prisma } from '@prisma/client';

export class UpdateOrderTrackingInteractor
  implements IUpdateOrderTrackingInteractor
{
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: number, trackingNumber: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // 物理商品が含まれているかチェック
    const orderItems = await prisma.orderItems.findMany({
      where: { orderId },
      include: {
        item: true,
      },
    });

    type OrderItemWithItem = Prisma.OrderItemsGetPayload<{
      include: { item: true };
    }>;

    const hasPhysicalItems = orderItems.some(
      (orderItem: OrderItemWithItem) =>
        orderItem.item && orderItem.item.type === 1,
    );

    if (!hasPhysicalItems) {
      throw new Error('This order does not contain physical items');
    }

    // 既にSHIPPEDの場合はエラー
    if (order.orderStatus === 'SHIPPED') {
      throw new Error('This order has already been shipped');
    }

    // COMPLETEDでない場合はエラー
    if (order.orderStatus !== 'COMPLETED') {
      throw new Error('This order is not ready for shipping');
    }

    await this.orderRepository.updateTrackingNumber(orderId, trackingNumber);
  }
}
