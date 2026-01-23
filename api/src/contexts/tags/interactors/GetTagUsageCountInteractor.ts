import { IGetTagUsageCountInteractor } from '../usecases/IGetTagUsageCountInteractor';
import { ITagRepository } from '../domains/repositories/ITagRepository';

export class GetTagUsageCountInteractor implements IGetTagUsageCountInteractor {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: number): Promise<number> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new Error('Tag not found');
    }

    return await this.tagRepository.getUsageCount(id);
  }
}
