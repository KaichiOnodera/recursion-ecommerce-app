import { Item } from '../../domains/entities/Item';
import { ItemImage } from '../../domains/entities/ItemImage';

export interface IUpdateItemInteractor {
  execute(
    id: number,
    name?: string,
    description?: string,
    type?: number,
    price?: number,
    inventoryAmount?: number,
    files?: Express.Multer.File[],
  ): Promise<{ item: Item; images: ItemImage[] } | null>;
}
