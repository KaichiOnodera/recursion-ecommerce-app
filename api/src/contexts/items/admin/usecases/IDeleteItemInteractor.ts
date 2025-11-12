import { Item } from '../../domains/entities/Item';

export interface IDeleteItemInteractor {
  execute(id: number): Promise<Item | null>;
}
