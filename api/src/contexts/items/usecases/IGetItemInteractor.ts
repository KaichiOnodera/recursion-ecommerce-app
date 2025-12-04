import { Item } from '../domains/entities/Item';

export interface IGetItemInteractor {
  execute(id: number): Promise<Item | null>;
}
