import { Item } from '../../domains/entities/Item';

export interface ICreateItemInteractor {
  execute(name: string, description: string, type: number): Promise<Item>;
}
