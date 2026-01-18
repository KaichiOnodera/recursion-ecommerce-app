import { ICreateTagInteractor } from '../usecases/ICreateTagInteractor';
import { ITagRepository } from '../domains/repositories/ITagRepository';
import { Tag } from '../domains/entities/Tag';

export class CreateTagInteractor implements ICreateTagInteractor {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(name: string): Promise<Tag> {
    const existingTag = await this.tagRepository.findByName(name);
    if (existingTag) {
      throw new Error('Tag with this name already exists');
    }

    return await this.tagRepository.create(name);
  }
}
