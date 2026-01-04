import { Item } from '../../domains/entities/Item';
import { ItemImage } from '../../domains/entities/ItemImage';

export interface ICreateItemInteractor {
  execute(
    name: string,
    description: string,
    type: number,
    price: number,
    files?: Express.Multer.File[],
  ): Promise<{ item: Item; images: ItemImage[] }>;
}
