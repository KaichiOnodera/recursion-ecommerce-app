import { PrismaClient, Prisma } from '@prisma/client';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { ItemQuery } from '../../domains/repositories/ItemQuery';
import { DisplayStatus, Item } from '../../domains/entities/Item';

export class ItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Item[]> {
    const items = await this.prisma.items.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        Inventory: true,
      },
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      displayStatus: this.isDisplayStatus(item.displayStatus)
        ? item.displayStatus
        : DisplayStatus.PRIVATE,
      inventory: {
        amount: item.Inventory?.[0]?.amount ?? 0,
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  async find(query?: ItemQuery): Promise<Item[]> {
    const prismaQuery = this.buildPrismaQuery(query);
    const items = await this.prisma.items.findMany({
      ...prismaQuery,
      include: {
        Inventory: true,
      },
    });
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      displayStatus: this.isDisplayStatus(item.displayStatus)
        ? item.displayStatus
        : DisplayStatus.PRIVATE,
      inventory: {
        amount: item.Inventory?.[0]?.amount ?? 0,
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  private buildPrismaQuery(query?: ItemQuery): Prisma.ItemsFindManyArgs {
    const prismaQuery: Prisma.ItemsFindManyArgs = {};

    if (query?.where) {
      prismaQuery.where = {};
      if (query.where.name?.contains) {
        prismaQuery.where.name = {
          contains: query.where.name.contains,
        };
      }
      if (query.where.displayStatus?.not) {
        prismaQuery.where.displayStatus = {
          not: query.where.displayStatus.not,
        };
      }
    }

    if (query?.orderBy) {
      prismaQuery.orderBy = query.orderBy;
    }

    if (query?.skip !== undefined) {
      prismaQuery.skip = query.skip;
    }
    if (query?.take !== undefined) {
      prismaQuery.take = query.take;
    }

    return prismaQuery;
  }

  async create(name: string, description: string, type: number): Promise<Item> {
    const item = await this.prisma.items.create({
      data: {
        name,
        description,
        type,
      },
    });

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      displayStatus: this.isDisplayStatus(item.displayStatus)
        ? item.displayStatus
        : DisplayStatus.PRIVATE,
      inventory: {
        amount: 0,
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async update(
    id: number,
    name?: string,
    description?: string,
    type?: number,
  ): Promise<Item | null> {
    const existingItem = await this.findById(id);

    if (!existingItem) {
      return null;
    }

    const updateData: {
      name?: string;
      description?: string;
      type?: number;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;

    const item = await this.prisma.items.update({
      where: { id },
      data: updateData,
    });

    const inventory = await this.prisma.inventory.findFirst({
      where: { itemId: item.id },
    });

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      displayStatus: this.isDisplayStatus(item.displayStatus)
        ? item.displayStatus
        : DisplayStatus.PRIVATE,
      inventory: {
        amount: inventory?.amount ?? 0,
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async delete(id: number): Promise<boolean> {
    const existingItem = await this.findById(id);

    if (!existingItem) {
      return false;
    }

    await this.prisma.items.delete({
      where: { id },
    });

    return true;
  }

  async findById(
    id: number,
    displayStatus?: DisplayStatus,
  ): Promise<Item | null> {
    const item = await this.prisma.items.findFirst({
      where: { id, displayStatus },
      include: {
        Inventory: true,
      },
    });

    return item
      ? {
          id: item.id,
          name: item.name,
          description: item.description,
          type: item.type,
          price: item.price,
          displayStatus: this.isDisplayStatus(item.displayStatus)
            ? item.displayStatus
            : DisplayStatus.PRIVATE,
          inventory: {
            amount: item.Inventory?.[0]?.amount ?? 0,
          },
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }
      : null;
  }

  private isDisplayStatus(
    displayStatus: string,
  ): displayStatus is DisplayStatus {
    return Object.values(DisplayStatus).includes(
      displayStatus as DisplayStatus,
    );
  }
}
