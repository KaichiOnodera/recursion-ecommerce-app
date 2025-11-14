import { PrismaClient } from '@prisma/client';
import { IItemImageRepository } from '../../domains/repositories/IItemImageRepository';
import { ItemImage } from '../../domains/entities/ItemImage';

export class ItemImageRepository implements IItemImageRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findbyItemId(id: number): Promise<ItemImage[]> {
        const itemImages = await this.prisma.itemImages.findMany({
            where: { itemId: id },
            orderBy: { order: 'asc' },
        });

        return itemImages;
    }
}