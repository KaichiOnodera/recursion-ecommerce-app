import { DisplayStatus, Item } from '../entities/Item';
import { ItemQuery } from './ItemQuery';

export interface IItemRepository {
  findAll(): Promise<Item[]>;
  find(query?: ItemQuery): Promise<Item[]>;
  findById(id: number, displayStatus?: DisplayStatus): Promise<Item | null>;
  create(name: string, description: string, type: number): Promise<Item>;
  update(
    id: number,
    name?: string,
    description?: string,
    type?: number,
    price?: number,
    inventoryAmount?: number,
  ): Promise<Item | null>;
  delete(id: number): Promise<boolean>;
}
