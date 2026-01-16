import { DisplayStatus, Item } from '../entities/Item';
import { ItemQuery } from './ItemQuery';

export interface IItemRepository {
  findAll(displayStatus?: DisplayStatus, userId?: number): Promise<Item[]>;
  find(query?: ItemQuery, userId?: number): Promise<Item[]>;
  findById(
    id: number,
    displayStatus?: DisplayStatus,
    userId?: number,
  ): Promise<Item | null>;
  findByTagIds?(tagIds: number[], userId?: number): Promise<Item[]>;
  findByStripeProductId(
    stripeProductId: string,
    displayStatus?: DisplayStatus,
    userId?: number,
  ): Promise<Item | null>;
  create(name: string, description: string, type: number): Promise<Item>;
  update(
    id: number,
    name?: string,
    description?: string,
    type?: number,
    price?: number,
    inventoryAmount?: number,
    displayStatus?: DisplayStatus,
  ): Promise<Item | null>;
  delete(id: number): Promise<boolean>;
}
