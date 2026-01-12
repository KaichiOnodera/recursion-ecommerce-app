import { Wishlist } from '../domains/entities/Wishlist';

export interface IGetWishlistsInteractor {
  execute(userId: number): Promise<Wishlist[]>;
}
