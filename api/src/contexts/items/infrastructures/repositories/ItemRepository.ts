import { PrismaClient } from '@prisma/client';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { Item } from '../../domains/entities/Item';

export class ItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Item[]> {
    const items = await this.prisma.items.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return items;
  }

  async create(name: string, description: string, type: number): Promise<Item> {
    const item = await this.prisma.items.create({
      data: {
        name,
        description,
        type,
      },
    });

    return item;
  }

  async update(
    id: number,
    name?: string,
    description?: string,
    type?: number,
  ): Promise<Item | null> {
    // アイテムが存在するか
    const existingItem = await this.prisma.items.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return null;
    }

    // 更新データの構築
    const updateData: {
      name?: string;
      description?: string;
      type?: number;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;

    // アイテムの更新
    const item = await this.prisma.items.update({
      where: { id },
      data: updateData,
    });

    return item;
  }
}
