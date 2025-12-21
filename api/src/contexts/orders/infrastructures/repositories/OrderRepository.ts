import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from '../../domains/repositories/IOrderRepository';
import { Order } from '../../domains/entities/Order';

export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: number): Promise<Order[]> {
    const orders = await this.prisma.orders.findMany({
      where: { userId },
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.mapToOrder(order));
  }

  private mapToOrder(order: {
    id: number;
    userId: number | null;
    lastName: string;
    firstName: string;
    email: string;
    address: string;
    totalPrice: number;
    orderStatus: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems: Array<{
      id: number;
      itemId: number | null;
      itemName: string;
      itemPrice: number;
      amount: number;
    }>;
  }): Order {
    return {
      id: order.id,
      userId: order.userId,
      lastName: order.lastName,
      firstName: order.firstName,
      email: order.email,
      address: order.address,
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderItems.map((item) => ({
        id: item.id,
        itemId: item.itemId,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        amount: item.amount,
      })),
    };
  }
}
