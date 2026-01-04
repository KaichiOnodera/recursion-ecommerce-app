import { IGetItemsInteractor } from '../usecases/IGetItemsInteractor';
import { IItemRepository } from '../domains/repositories/IItemRepository';
import { DisplayStatus, Item } from '../domains/entities/Item';

export class GetItemsInteractor implements IGetItemsInteractor {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly displayStatus?: DisplayStatus,
  ) {}

  async execute(): Promise<Item[]> {
    // displayStatusが指定されていない場合は全ての商品を取得（管理者向け）
    // displayStatusが指定されている場合はその条件でフィルタリング（一般ユーザー向け）
    return await this.itemRepository.findAll(this.displayStatus);
  }
}
