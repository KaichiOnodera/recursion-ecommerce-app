import { IUpdateWishlistInteractor } from '../usecases/IUpdateWishlistInteractor';
import { IWishlistRepository } from '../domains/repositories/IWishlistRepository';
import { Wishlist } from '../domains/entities/Wishlist';

export class UpdateWishlistInteractor implements IUpdateWishlistInteractor {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async execute(
    wishlistId: number,
    name: string | null | undefined,
    isPublic: boolean | undefined,
    userId: number,
  ): Promise<Wishlist> {
    // ウィッシュリストが存在し、ユーザーが所有しているか確認
    const wishlist = await this.wishlistRepository.findWishlistByIdAndUserId(
      wishlistId,
      userId,
    );

    if (!wishlist) {
      throw new Error('Wishlist not found or access denied');
    }

    // ウィッシュリストを更新
    const updatedWishlist = await this.wishlistRepository.updateWishlist(
      wishlistId,
      name,
      isPublic,
    );

    if (!updatedWishlist) {
      throw new Error('Failed to update wishlist');
    }

    return updatedWishlist;
  }
}
