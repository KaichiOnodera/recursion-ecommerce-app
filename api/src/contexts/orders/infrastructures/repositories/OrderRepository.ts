import { PrismaClient, Prisma, OrderStatus } from '@prisma/client';
import {
  IOrderRepository,
  CreateOrderData,
  CreateOrderPaymentExternalIdData,
} from '../../domains/repositories/IOrderRepository';
import { Order } from '../../domains/entities/Order';
import { OrderPaymentExternalId } from '../../domains/entities/OrderPaymentExternalId';

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

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.orders.findMany({
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.mapToOrder(order));
  }

  async create(data: CreateOrderData): Promise<Order> {
    const order = await this.prisma.orders.create({
      data: {
        userId: data.userId,
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        address: data.address,
        totalPrice: data.totalPrice,
        orderStatus: data.orderStatus ?? OrderStatus.PENDING,
        orderItems: {
          create: data.orderItems.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            itemPrice: item.itemPrice,
            amount: item.amount,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    } as Prisma.OrdersCreateArgs);

    return this.mapToOrder(
      order as Prisma.OrdersGetPayload<{
        include: { orderItems: true };
      }>,
    );
  }

  async getByStripeSessionId(sessionId: string): Promise<Order | null> {
    const paymentExternalId =
      await this.prisma.orderPaymentExternalIds.findFirst({
        where: {
          provider: 'STRIPE',
          paymentSessionId: sessionId,
        },
        include: {
          order: {
            include: {
              orderItems: true,
            },
          },
        },
      });

    if (!paymentExternalId?.order) {
      return null;
    }

    return this.mapToOrder(paymentExternalId.order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.prisma.orders.update({
      where: { id },
      data: {
        orderStatus: status,
      },
      include: {
        orderItems: true,
      },
    });

    return this.mapToOrder(order);
  }

  async createPaymentExternalId(
    data: CreateOrderPaymentExternalIdData,
  ): Promise<OrderPaymentExternalId> {
    const paymentExternalId = await this.prisma.orderPaymentExternalIds.create({
      data: {
        orderId: data.orderId,
        provider: data.provider,
        paymentSessionId: data.paymentSessionId ?? null,
        paymentId: data.paymentId ?? null,
      },
    });

    return {
      id: paymentExternalId.id,
      orderId: paymentExternalId.orderId,
      provider: paymentExternalId.provider,
      paymentSessionId: paymentExternalId.paymentSessionId,
      paymentId: paymentExternalId.paymentId,
      createdAt: paymentExternalId.createdAt,
      updatedAt: paymentExternalId.updatedAt,
    };
  }

  async updatePaymentExternalIdBySessionId(
    paymentSessionId: string,
    paymentId: string,
  ): Promise<OrderPaymentExternalId | null> {
    const paymentExternalId =
      await this.prisma.orderPaymentExternalIds.findUnique({
        where: {
          provider_paymentSessionId: {
            provider: 'STRIPE',
            paymentSessionId,
          },
        },
      });

    if (!paymentExternalId) {
      return null;
    }

    const updated = await this.prisma.orderPaymentExternalIds.update({
      where: {
        id: paymentExternalId.id,
      },
      data: {
        paymentId,
      },
    });

    return {
      id: updated.id,
      orderId: updated.orderId,
      provider: updated.provider,
      paymentSessionId: updated.paymentSessionId,
      paymentId: updated.paymentId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  private mapToOrder(
    order: Prisma.OrdersGetPayload<{
      include: { orderItems: true };
    }>,
  ): Order {
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
