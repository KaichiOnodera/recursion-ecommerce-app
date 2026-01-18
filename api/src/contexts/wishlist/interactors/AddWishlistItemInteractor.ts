import { IAddWishlistItemInteractor } from '../usecases/IAddWishlistItemInteractor';
import { IWishlistRepository } from '../domains/repositories/IWishlistRepository';
import { IItemRepository } from '../../items/domains/repositories/IItemRepository';
import { WishlistItem } from '../domains/entities/WishlistItem';

export class AddWishlistItemInteractor implements IAddWishlistItemInteractor {
  constructor(
    private readonly wishlistRepository: IWishlistRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(
    wishlistId: number,
    itemId: number,
    userId: number,
  ): Promise<WishlistItem> {
    // ウィッシュリストが存在し、ユーザーが所有しているか確認
    const wishlist = await this.wishlistRepository.findWishlistByIdAndUserId(
      wishlistId,
      userId,
    );

    if (!wishlist) {
      throw new Error('Wishlist not found or access denied');
    }

    // 商品が存在するかチェック
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    // 既にウィッシュリストに追加されているかチェック
    const exists = await this.wishlistRepository.existsWishlistItem(
      wishlistId,
      itemId,
    );

    if (exists) {
      throw new Error('Item already exists in wishlist');
    }

    return await this.wishlistRepository.addWishlistItem(wishlistId, itemId);
  }
}
