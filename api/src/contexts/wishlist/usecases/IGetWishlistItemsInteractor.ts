import { WishlistItemWithItem } from '../domains/entities/WishlistItem';

export interface IGetWishlistItemsInteractor {
  execute(wishlistId: number, userId: number): Promise<WishlistItemWithItem[]>;
}
