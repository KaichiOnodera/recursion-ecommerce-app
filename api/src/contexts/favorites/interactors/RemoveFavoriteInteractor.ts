import { IRemoveFavoriteInteractor } from '../usecases/IRemoveFavoriteInteractor';
import { IFavoriteRepository } from '../domains/repositories/IFavoriteRepository';

export class RemoveFavoriteInteractor implements IRemoveFavoriteInteractor {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(userId: number, itemId: number): Promise<void> {
    // お気に入りが存在するかチェック
    const existingFavorite =
      await this.favoriteRepository.findByUserIdAndItemId(userId, itemId);

    if (!existingFavorite) {
      throw new Error('Favorite not found');
    }

    await this.favoriteRepository.delete(userId, itemId);
  }
}
