import { IGetItemsInteractor } from '../usecases/IGetItemsInteractor';
import { IItemRepository } from '../domains/repositories/IItemRepository';
import { DisplayStatus, Item } from '../domains/entities/Item';

export class GetItemsInteractor implements IGetItemsInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(): Promise<Item[]> {
    return await this.itemRepository.findAll(DisplayStatus.PUBLIC);
  }
}
