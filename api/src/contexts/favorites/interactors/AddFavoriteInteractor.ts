import { IAddFavoriteInteractor } from '../usecases/IAddFavoriteInteractor';
import { IFavoriteRepository } from '../domains/repositories/IFavoriteRepository';
import { IItemRepository } from '../../items/domains/repositories/IItemRepository';
import { Favorite } from '../domains/entities/Favorite';

export class AddFavoriteInteractor implements IAddFavoriteInteractor {
  constructor(
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(userId: number, itemId: number): Promise<Favorite> {
    // 商品が存在するかチェック
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    // 既存のお気に入りをチェック
    const existingFavorite =
      await this.favoriteRepository.findByUserIdAndItemId(userId, itemId);

    if (existingFavorite) {
      throw new Error('Favorite already exists for this item');
    }

    return await this.favoriteRepository.create(userId, itemId);
  }
}
