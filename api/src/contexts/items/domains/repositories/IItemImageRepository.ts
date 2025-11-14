import { ItemImage } from '../entities/ItemImage';

export interface IItemImageRepository {
    findbyItemId(id: number): Promise<ItemImage[]>;
}