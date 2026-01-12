import { IDeleteTagInteractor } from '../usecases/IDeleteTagInteractor';
import { ITagRepository } from '../domains/repositories/ITagRepository';

export class DeleteTagInteractor implements IDeleteTagInteractor {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.tagRepository.delete(id);
  }
}
