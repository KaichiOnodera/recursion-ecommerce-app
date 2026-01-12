import { Tag } from '../entities/Tag';

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findByItemId(itemId: number): Promise<Tag[]>;
  create(name: string): Promise<Tag>;
  update(id: number, name: string): Promise<Tag | null>;
  delete(id: number): Promise<boolean>;
  // 商品とタグの関連付け
  attachTagsToItem(itemId: number, tagIds: number[]): Promise<void>;
  detachTagsFromItem(itemId: number, tagIds: number[]): Promise<void>;
  replaceItemTags(itemId: number, tagIds: number[]): Promise<void>;
}
