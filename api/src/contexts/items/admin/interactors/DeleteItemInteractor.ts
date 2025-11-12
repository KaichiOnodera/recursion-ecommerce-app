import { IDeleteItemInteractor } from '../usecases/IDeleteItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { Item } from '../../domains/entities/Item';

export class DleteItemInteractor implements IDeleteItemInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: number): Promise<Item | null> {
    return await this.itemRepository.delete(id);
  }
}
