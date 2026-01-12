import { ICreateWishlistInteractor } from '../usecases/ICreateWishlistInteractor';
import { IWishlistRepository } from '../domains/repositories/IWishlistRepository';
import { Wishlist } from '../domains/entities/Wishlist';

export class CreateWishlistInteractor implements ICreateWishlistInteractor {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(
    userId: number,
    name: string | null,
    isPublic: boolean,
  ): Promise<Wishlist> {
    return await this.wishlistRepository.createWishlist(userId, name, isPublic);
  }
}
