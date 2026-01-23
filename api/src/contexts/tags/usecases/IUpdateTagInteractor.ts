import { Tag } from '../domains/entities/Tag';

export interface IUpdateTagInteractor {
  execute(id: number, name: string): Promise<Tag | null>;
}
