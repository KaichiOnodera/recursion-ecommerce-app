import { IGetWishlistItemsInteractor } from '../usecases/IGetWishlistItemsInteractor';
import { IWishlistRepository } from '../domains/repositories/IWishlistRepository';
import { WishlistItemWithItem } from '../domains/entities/WishlistItem';

export class GetWishlistItemsInteractor implements IGetWishlistItemsInteractor {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(
    wishlistId: number,
    userId: number,
  ): Promise<WishlistItemWithItem[]> {
    // ユーザーが所有するウィッシュリストか確認
    const ownedWishlist =
      await this.wishlistRepository.findWishlistByIdAndUserId(
        wishlistId,
        userId,
      );

    if (ownedWishlist) {
      // 所有している場合は商品一覧を取得
      return await this.wishlistRepository.findWishlistItemsByWishlistId(
        wishlistId,
      );
    }

    // 公開されているウィッシュリストか確認（所有者のIDは不要）
    const publicWishlist =
      await this.wishlistRepository.findPublicWishlistByIdOnly(wishlistId);

    if (publicWishlist) {
      // 公開されている場合は商品一覧を取得
      return await this.wishlistRepository.findWishlistItemsByWishlistId(
        wishlistId,
      );
    }

    // 所有しておらず、公開もされていない場合はエラー
    throw new Error('Wishlist not found or access denied');
  }
}
