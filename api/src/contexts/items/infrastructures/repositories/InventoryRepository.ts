import { PrismaClient } from '@prisma/client';
import { IInventoryRepository } from '../../domains/repositories/IInventoryRepository';

export class InventoryRepository implements IInventoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async decreaseStock(itemId: number, amount: number): Promise<void> {
    await this.prisma.inventory.updateMany({
      where: { itemId },
      data: {
        amount: { decrement: amount },
      },
    });
  }
}
