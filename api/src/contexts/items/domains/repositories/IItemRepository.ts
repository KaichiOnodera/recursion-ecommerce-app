import { Item } from "../entities/Item";

export interface IItemRepository {
  findAll(): Promise<Item[]>;
}
