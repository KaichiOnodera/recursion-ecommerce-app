import { PrismaClient } from "@prisma/client";
import { IItemRepository } from "../../domains/repositories/IItemRepository";
import { Item } from "../../domains/entities/Item";

export class ItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Item[]> {
    const items = await this.prisma.items.findMany({
      orderBy: { createdAt: "desc" }
    });

    return items;
  }
}
