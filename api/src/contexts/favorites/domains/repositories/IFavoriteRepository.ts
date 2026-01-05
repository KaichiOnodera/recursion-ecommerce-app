import { Favorite } from '../entities/Favorite';
import { FavoriteItem } from '../entities/FavoriteItem';

export interface FindFavoritesResult {
  readonly favorites: readonly FavoriteItem[];
  readonly total: number;
}

export interface IFavoriteRepository {
  create(userId: number, itemId: number): Promise<Favorite>;
  findByUserIdAndItemId(
    userId: number,
    itemId: number,
  ): Promise<Favorite | null>;
  findByUserId(userId: number): Promise<FindFavoritesResult>;
  delete(userId: number, itemId: number): Promise<void>;
}
