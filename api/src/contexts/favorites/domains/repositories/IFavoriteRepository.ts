import { Favorite } from '../entities/Favorite';

export interface IFavoriteRepository {
  create(userId: number, itemId: number): Promise<Favorite>;
  findByUserIdAndItemId(
    userId: number,
    itemId: number,
  ): Promise<Favorite | null>;
}
