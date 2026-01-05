import { Item } from '../domains/entities/Item';

export interface IGetItemsInteractor {
  execute(userId?: number): Promise<Item[]>;
}
