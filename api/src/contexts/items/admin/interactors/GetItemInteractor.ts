import { IGetItemInteractor } from '../usecases/IGetItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { Item } from '../../domains/entities/Item';

export class GetItemInteractor implements IGetItemInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: number): Promise<Item | null> {
    // 管理者向けなのでdisplayStatusフィルタリングなし
    const item = await this.itemRepository.findById(id);

    return item;
  }
}
