import { Item } from '../domains/entities/Item';

export interface IGetItemInteractor {
  execute(id: number, userId?: number): Promise<Item | null>;
}
