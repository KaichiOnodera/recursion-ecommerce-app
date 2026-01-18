import { Wishlist } from '../domains/entities/Wishlist';

export interface IUpdateWishlistInteractor {
  execute(
    wishlistId: number,
    name: string | null | undefined,
    isPublic: boolean | undefined,
    userId: number,
  ): Promise<Wishlist>;
}
