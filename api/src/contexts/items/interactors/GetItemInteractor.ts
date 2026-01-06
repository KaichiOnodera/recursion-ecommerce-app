import { IGetItemInteractor } from '../usecases/IGetItemInteractor';
import { IItemRepository } from '../domains/repositories/IItemRepository';
import { DisplayStatus, Item } from '../domains/entities/Item';

export class GetItemInteractor implements IGetItemInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: number, userId?: number): Promise<Item | null> {
    const item = await this.itemRepository.findById(
      id,
      DisplayStatus.PUBLIC,
      userId,
    );

    return item;
  }
}
