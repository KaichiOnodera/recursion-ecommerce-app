import { Item } from '../../domains/entities/Item';

export interface IUpdateItemInteractor {
  execute(
    id: number,
    name?: string,
    description?: string,
    type?: number,
  ): Promise<Item | null>;
}
