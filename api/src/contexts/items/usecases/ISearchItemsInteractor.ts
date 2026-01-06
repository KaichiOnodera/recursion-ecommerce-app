import { Item } from '../domains/entities/Item';
import { SearchItemsParams } from '@shared/schemas/item';

export interface ISearchItemsInteractor {
  execute(params: SearchItemsParams, userId?: number): Promise<Item[]>;
}
