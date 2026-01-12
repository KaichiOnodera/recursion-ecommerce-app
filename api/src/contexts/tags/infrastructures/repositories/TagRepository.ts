import { PrismaClient } from '@prisma/client';
import { ITagRepository } from '../../domains/repositories/ITagRepository';
import { Tag } from '../../domains/entities/Tag';

export class TagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tags.findMany({
      orderBy: { name: 'asc' },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));
  }

  async findById(id: number): Promise<Tag | null> {
    const tag = await this.prisma.tags.findUnique({
      where: { id },
    });

    if (!tag) {
      return null;
    }

    return {
      id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await this.prisma.tags.findUnique({
      where: { name },
    });

    if (!tag) {
      return null;
    }

    return {
      id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  async findByItemId(itemId: number): Promise<Tag[]> {
    const itemTags = await this.prisma.itemTags.findMany({
      where: { itemId },
      include: {
        tag: true,
      },
      orderBy: {
        tag: {
          name: 'asc',
        },
      },
    });

    return itemTags.map((itemTag) => ({
      id: itemTag.tag.id,
      name: itemTag.tag.name,
      createdAt: itemTag.tag.createdAt,
      updatedAt: itemTag.tag.updatedAt,
    }));
  }

  async create(name: string): Promise<Tag> {
    const tag = await this.prisma.tags.create({
      data: { name },
    });

    return {
      id: tag.id,
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  async update(id: number, name: string): Promise<Tag | null> {
    try {
      const tag = await this.prisma.tags.update({
        where: { id },
        data: { name },
      });

      return {
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      };
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.tags.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async attachTagsToItem(itemId: number, tagIds: number[]): Promise<void> {
    if (tagIds.length === 0) {
      return;
    }

    await this.prisma.itemTags.createMany({
      data: tagIds.map((tagId) => ({
        itemId,
        tagId,
      })),
      skipDuplicates: true,
    });
  }

  async detachTagsFromItem(itemId: number, tagIds: number[]): Promise<void> {
    if (tagIds.length === 0) {
      return;
    }

    await this.prisma.itemTags.deleteMany({
      where: {
        itemId,
        tagId: {
          in: tagIds,
        },
      },
    });
  }

  async replaceItemTags(itemId: number, tagIds: number[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.itemTags.deleteMany({
        where: { itemId },
      });

      if (tagIds.length > 0) {
        await tx.itemTags.createMany({
          data: tagIds.map((tagId) => ({
            itemId,
            tagId,
          })),
        });
      }
    });
  }
}
