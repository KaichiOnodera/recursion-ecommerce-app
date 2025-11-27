import { IDeleteItemInteractor } from '../usecases/IDeleteItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';

export class DeleteItemInteractor implements IDeleteItemInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.itemRepository.delete(id);
  }
}
