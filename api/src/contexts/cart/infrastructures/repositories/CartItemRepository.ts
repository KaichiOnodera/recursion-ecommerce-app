import { PrismaClient } from '@prisma/client';
import { ICartItemRepository } from '../../domains/repositories/ICartItemRepository';

export class CartItemRepository implements ICartItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(cartId: number, itemId: number, amount: number): Promise<void> {
    await this.prisma.cartItems.upsert({
      where: {
        cartId_itemId: {
          cartId,
          itemId,
        },
      },
      update: {
        amount,
      },
      create: {
        cartId,
        itemId,
        amount,
      },
    });
  }
}
