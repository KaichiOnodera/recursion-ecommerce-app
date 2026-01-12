import { Tag } from '../domains/entities/Tag';

export interface ICreateTagInteractor {
  execute(name: string): Promise<Tag>;
}
