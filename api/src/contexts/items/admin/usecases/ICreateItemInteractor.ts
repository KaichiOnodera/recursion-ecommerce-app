import { Item } from '../../domains/entities/Item';
import { ItemImage } from '../../domains/entities/ItemImage';
import { DisplayStatus } from '../../domains/entities/Item';

export interface ICreateItemInteractor {
  execute(
    name: string,
    description: string,
    type: number,
    price: number,
    files?: Express.Multer.File[],
    displayStatus?: DisplayStatus,
    tagIds?: number[],
  ): Promise<{ item: Item; images: ItemImage[] }>;
}
