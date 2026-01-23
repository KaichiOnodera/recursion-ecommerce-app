import { WishlistItem } from '../domains/entities/WishlistItem';

export interface IAddWishlistItemInteractor {
  execute(
    wishlistId: number,
    itemId: number,
    userId: number,
  ): Promise<WishlistItem>;
}
