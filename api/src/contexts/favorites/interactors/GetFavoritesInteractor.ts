import { IGetFavoritesInteractor } from '../usecases/IGetFavoritesInteractor';
import { IFavoriteRepository } from '../domains/repositories/IFavoriteRepository';
import { FindFavoritesResult } from '../domains/repositories/IFavoriteRepository';

export class GetFavoritesInteractor implements IGetFavoritesInteractor {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(userId: number): Promise<FindFavoritesResult> {
    return await this.favoriteRepository.findByUserId(userId);
  }
}
