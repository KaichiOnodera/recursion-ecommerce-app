import { FindFavoritesResult } from '../domains/repositories/IFavoriteRepository';

export interface IGetFavoritesInteractor {
  execute(userId: number): Promise<FindFavoritesResult>;
}
