import { IGetItemInteractor } from '../usecases/IGetItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { Item } from '../../domains/entities/Item';

export class GetItemInteractor implements IGetItemInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: number, userId?: number): Promise<Item | null> {
    // 管理者向けなのでdisplayStatusフィルタリングなし
    // 管理者向けではお気に入り情報は不要なのでuserIdは渡さない
    const item = await this.itemRepository.findById(id, undefined, userId);

    return item;
  }
}
