import { Item } from '../../domains/entities/Item';
import { ItemImage } from '../../domains/entities/ItemImage';
import { DisplayStatus } from '../../domains/entities/Item';

export interface IUpdateItemInteractor {
  execute(
    id: number,
    name?: string,
    description?: string,
    type?: number,
    price?: number,
    inventoryAmount?: number,
    files?: Express.Multer.File[],
    displayStatus?: DisplayStatus,
  ): Promise<{ item: Item; images: ItemImage[] } | null>;
}
