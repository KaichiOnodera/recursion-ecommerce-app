import { OrderItemFile } from '../../domains/entities/OrderItemFile';
import { IOrderItemFileRepository } from '../../domains/repositories/IOrderItemFileRepository';
import { PrismaClient, Prisma } from '@prisma/client';

export class OrderItemFileRepository implements IOrderItemFileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<OrderItemFile> {
    const orderItemFile = await this.prisma.orderItemFiles.findUnique({
      where: { id },
    });

    if (!orderItemFile) {
      throw new Error(`OrderItemFile with id ${id} not found`);
    }

    return {
      id: orderItemFile.id,
      orderId: orderItemFile.orderId,
      itemId: orderItemFile.itemId,
      createdAt: orderItemFile.createdAt,
      updatedAt: orderItemFile.updatedAt,
    };
  }

  async findByOrderId(orderId: number): Promise<OrderItemFile[]> {
    const orderItemFiles = await this.prisma.orderItemFiles.findMany({
      where: { orderId },
    });

    return orderItemFiles.map((orderItemFile) => ({
      id: orderItemFile.id,
      orderId: orderItemFile.orderId,
      itemId: orderItemFile.itemId,
      createdAt: orderItemFile.createdAt,
      updatedAt: orderItemFile.updatedAt,
    }));
  }

  async create(orderId: number, itemId: number): Promise<OrderItemFile> {
    const orderItemFile = await this.prisma.orderItemFiles.create({
      data: {
        orderId,
        itemId,
      },
    } as Prisma.OrderItemFilesCreateArgs);

    return {
      id: orderItemFile.id,
      orderId: orderItemFile.orderId,
      itemId: orderItemFile.itemId,
      createdAt: orderItemFile.createdAt,
      updatedAt: orderItemFile.updatedAt,
    };
  }
}
