import { PrismaClient } from '@prisma/client';
import { IItemImageRepository } from '../../domains/repositories/IItemImageRepository';
import { ItemImage } from '../../domains/entities/ItemImage';

export class ItemImageRepository implements IItemImageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByItemId(itemId: number): Promise<ItemImage[]> {
    const images = await this.prisma.itemImages.findMany({
      where: { itemId },
      orderBy: { order: 'asc' },
    });

    return images.map((image) => ({
      id: image.id,
      itemId: image.itemId,
      src: image.src,
      order: image.order,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    }));
  }

  async create(itemId: number, src: string, order: number): Promise<ItemImage> {
    const image = await this.prisma.itemImages.create({
      data: {
        itemId,
        src,
        order,
      },
    });

    return {
      id: image.id,
      itemId: image.itemId,
      src: image.src,
      order: image.order,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.itemImages.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateOrder(id: number, order: number): Promise<ItemImage> {
    const image = await this.prisma.itemImages.update({
      where: { id },
      data: { order },
    });

    return {
      id: image.id,
      itemId: image.itemId,
      src: image.src,
      order: image.order,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }

  async getMaxOrder(itemId: number): Promise<number> {
    const result = await this.prisma.itemImages.aggregate({
      where: { itemId },
      _max: { order: true },
    });

    return result._max.order ?? 0;
  }

  async countByItemId(itemId: number): Promise<number> {
    return this.prisma.itemImages.count({
      where: { itemId },
    });
  }

  async findById(id: number): Promise<ItemImage | null> {
    const image = await this.prisma.itemImages.findUnique({
      where: { id },
    });

    if (!image) {
      return null;
    }

    return {
      id: image.id,
      itemId: image.itemId,
      src: image.src,
      order: image.order,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }
}
