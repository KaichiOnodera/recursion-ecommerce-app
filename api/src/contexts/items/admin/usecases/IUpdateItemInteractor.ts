import { Item } from '../../domains/entities/Item';

export interface IUpdateItemInteractor {
  execute(
    id: number,
    name?: string,
    description?: string,
    type?: number,
    price?: number,
    inventoryAmount?: number,
  ): Promise<Item | null>;
}
