import { Item } from '../entities/Item';

export interface IItemRepository {
  findAll(): Promise<Item[]>;
  create(name: string, description: string, type: number): Promise<Item>;
}
