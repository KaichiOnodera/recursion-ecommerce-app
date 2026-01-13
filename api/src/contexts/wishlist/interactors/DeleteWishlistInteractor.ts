import { IDeleteWishlistInteractor } from '../usecases/IDeleteWishlistInteractor';
import { IWishlistRepository } from '../domains/repositories/IWishlistRepository';

export class DeleteWishlistInteractor implements IDeleteWishlistInteractor {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(wishlistId: number, userId: number): Promise<void> {
    // ウィッシュリストが存在し、ユーザーが所有しているか確認
    const wishlist = await this.wishlistRepository.findWishlistByIdAndUserId(
      wishlistId,
      userId,
    );

    if (!wishlist) {
      throw new Error('Wishlist not found or access denied');
    }

    await this.wishlistRepository.deleteWishlist(wishlistId);
  }
}
