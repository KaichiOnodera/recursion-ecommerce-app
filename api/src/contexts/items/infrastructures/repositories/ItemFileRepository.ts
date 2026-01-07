import { PrismaClient } from '@prisma/client';
import { IItemFileRepository } from '../../domains/repositories/IItemFilesRespository';
import { ItemFile } from '../../domains/entities/ItemFile';

export class ItemFileRepository implements IItemFileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<ItemFile | null> {
    const itemfile = await this.prisma.itemFiles.findUnique({
      where: { id },
    });

    if (!itemfile) {
      return null;
    }

    return {
      id: itemfile.id,
      itemId: itemfile.itemId,
      filename: itemfile.filename,
      path: itemfile.path,
      createdAt: itemfile.createdAt,
      updatedAt: itemfile.updatedAt,
    };
  }

  async findByItemId(itemId: number): Promise<ItemFile[]> {
    const itemfiles = await this.prisma.itemFiles.findMany({
      where: { itemId },
      orderBy: { createdAt: 'asc' },
    });

    return itemfiles.map((itemfile) => ({
      id: itemfile.id,
      itemId: itemfile.itemId,
      filename: itemfile.filename,
      path: itemfile.path,
      createdAt: itemfile.createdAt,
      updatedAt: itemfile.updatedAt,
    }));
  }

  async create(
    itemId: number,
    filename: string,
    path: string,
  ): Promise<ItemFile> {
    const itemfile = await this.prisma.itemFiles.create({
      data: {
        itemId,
        filename,
        path,
      },
    });

    return {
      id: itemfile.id,
      itemId: itemfile.itemId,
      filename: itemfile.filename,
      path: itemfile.path,
      createdAt: itemfile.createdAt,
      updatedAt: itemfile.updatedAt,
    };
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.itemFiles.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async deleteByItemId(itemId: number): Promise<boolean> {
    await this.prisma.itemFiles.deleteMany({
      where: { itemId },
    });
    return true;
  }
}
