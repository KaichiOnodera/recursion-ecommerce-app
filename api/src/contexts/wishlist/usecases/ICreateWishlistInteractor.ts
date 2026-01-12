import { Wishlist } from '../domains/entities/Wishlist';

export interface ICreateWishlistInteractor {
  execute(
    userId: number,
    name: string | null,
    isPublic: boolean,
  ): Promise<Wishlist>;
}
