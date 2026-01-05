import { Favorite } from '../domains/entities/Favorite';

export interface IAddFavoriteInteractor {
  execute(userId: number, itemId: number): Promise<Favorite>;
}
