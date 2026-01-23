import { PrismaClient } from '@prisma/client';
import { IItemStripeMappingRepository } from '../../domains/repositories/IItemStripeMappingRepository';
import { ItemStripeMapping } from '../../domains/entities/ItemStripeMapping';

export class ItemStripeMappingRepository
  implements IItemStripeMappingRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async findByItemId(itemId: number): Promise<ItemStripeMapping | null> {
    const mapping = await this.prisma.itemStripeMapping.findUnique({
      where: { itemId },
    });

    if (!mapping) {
      return null;
    }

    return {
      id: mapping.id,
      itemId: mapping.itemId,
      stripeProductId: mapping.stripeProductId,
      stripePriceId: mapping.stripePriceId,
      createdAt: mapping.createdAt,
      updatedAt: mapping.updatedAt,
    };
  }

  async findByStripeProductId(
    stripeProductId: string,
  ): Promise<ItemStripeMapping | null> {
    const mapping = await this.prisma.itemStripeMapping.findUnique({
      where: { stripeProductId },
    });

    if (!mapping) {
      return null;
    }

    return {
      id: mapping.id,
      itemId: mapping.itemId,
      stripeProductId: mapping.stripeProductId,
      stripePriceId: mapping.stripePriceId,
      createdAt: mapping.createdAt,
      updatedAt: mapping.updatedAt,
    };
  }

  async create(
    itemId: number,
    stripeProductId: string,
    stripePriceId?: string,
  ): Promise<ItemStripeMapping> {
    const mapping = await this.prisma.itemStripeMapping.create({
      data: {
        itemId,
        stripeProductId,
        stripePriceId: stripePriceId ?? null,
      },
    });

    return {
      id: mapping.id,
      itemId: mapping.itemId,
      stripeProductId: mapping.stripeProductId,
      stripePriceId: mapping.stripePriceId,
      createdAt: mapping.createdAt,
      updatedAt: mapping.updatedAt,
    };
  }

  async update(
    itemId: number,
    stripeProductId: string,
    stripePriceId?: string,
  ): Promise<ItemStripeMapping> {
    const mapping = await this.prisma.itemStripeMapping.update({
      where: { itemId },
      data: {
        stripeProductId,
        stripePriceId: stripePriceId ?? null,
      },
    });

    return {
      id: mapping.id,
      itemId: mapping.itemId,
      stripeProductId: mapping.stripeProductId,
      stripePriceId: mapping.stripePriceId,
      createdAt: mapping.createdAt,
      updatedAt: mapping.updatedAt,
    };
  }

  async delete(itemId: number): Promise<void> {
    await this.prisma.itemStripeMapping.delete({
      where: { itemId },
    });
  }
}
