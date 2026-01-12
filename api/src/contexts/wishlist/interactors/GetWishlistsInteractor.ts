import { IGetWishlistsInteractor } from '../usecases/IGetWishlistsInteractor';
import { IWishlistRepository } from '../domains/repositories/IWishlistRepository';
import { Wishlist } from '../domains/entities/Wishlist';

export class GetWishlistsInteractor implements IGetWishlistsInteractor {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(userId: number): Promise<Wishlist[]> {
    return await this.wishlistRepository.findWishlistsByUserId(userId);
  }
}
