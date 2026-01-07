import { ItemFile } from '../entities/ItemFile';

export interface IItemFileRepository {
  findByItemId(itemId: number): Promise<ItemFile[]>;
  findById(id: number): Promise<ItemFile | null>;
  create(itemId: number, filename: string, path: string): Promise<ItemFile>;
  delete(id: number): Promise<boolean>;
  deleteByItemId(itemId: number): Promise<boolean>;
}
