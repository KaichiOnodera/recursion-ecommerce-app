import { IGetTagsInteractor } from '../usecases/IGetTagsInteractor';
import { ITagRepository } from '../domains/repositories/ITagRepository';
import { Tag } from '../domains/entities/Tag';

export class GetTagsInteractor implements IGetTagsInteractor {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(itemId?: number): Promise<Tag[]> {
    if (itemId !== undefined) {
      return await this.tagRepository.findByItemId(itemId);
    }

    return await this.tagRepository.findAll();
  }
}
