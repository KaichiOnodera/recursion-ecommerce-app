import { ItemImage } from '../../domains/entities/ItemImage';

export interface IGetItemImagesInteractor {
  execute( itemId: number ): Promise<ItemImage[]>;
}
