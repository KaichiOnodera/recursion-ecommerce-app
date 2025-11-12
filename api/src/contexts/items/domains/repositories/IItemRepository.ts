import { Item } from '../entities/Item';

export interface IItemRepository {
  findAll(): Promise<Item[]>;
  create(name: string, description: string, type: number): Promise<Item>;
  update(
    id: number,
    name?: string,
    description?: string,
    type?: number,
  ): Promise<Item | null>;
  delete(id: number): Promise<Item | null>;
}
