import { IUpdateTagInteractor } from '../usecases/IUpdateTagInteractor';
import { ITagRepository } from '../domains/repositories/ITagRepository';
import { Tag } from '../domains/entities/Tag';

export class UpdateTagInteractor implements IUpdateTagInteractor {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: number, name: string): Promise<Tag | null> {
    const existingTag = await this.tagRepository.findByName(name);
    if (existingTag && existingTag.id !== id) {
      throw new Error('Tag with this name already exists');
    }

    return await this.tagRepository.update(id, name);
  }
}
