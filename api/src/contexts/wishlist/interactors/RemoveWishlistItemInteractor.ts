import { IRemoveWishlistItemInteractor } from '../usecases/IRemoveWishlistItemInteractor';
import { IWishlistRepository } from '../domains/repositories/IWishlistRepository';

export class RemoveWishlistItemInteractor
  implements IRemoveWishlistItemInteractor
{
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(
    wishlistId: number,
    itemId: number,
    userId: number,
  ): Promise<void> {
    // ウィッシュリストが存在し、ユーザーが所有しているか確認
    const wishlist = await this.wishlistRepository.findWishlistByIdAndUserId(
      wishlistId,
      userId,
    );

    if (!wishlist) {
      throw new Error('Wishlist not found or access denied');
    }

    // ウィッシュリスト内に商品が存在するかチェック
    const exists = await this.wishlistRepository.existsWishlistItem(
      wishlistId,
      itemId,
    );

    if (!exists) {
      throw new Error('Wishlist item not found');
    }

    await this.wishlistRepository.removeWishlistItem(wishlistId, itemId);
  }
}
