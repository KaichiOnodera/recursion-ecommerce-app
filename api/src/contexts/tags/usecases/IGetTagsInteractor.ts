import { Tag } from '../domains/entities/Tag';

export interface IGetTagsInteractor {
  execute(itemId?: number): Promise<Tag[]>;
}
