import { Wishlist } from '../entities/Wishlist';
import { WishlistItem } from '../entities/WishlistItem';
import { WishlistItemWithItem } from '../entities/WishlistItem';

export interface IWishlistRepository {
  // ユーザーのウィッシュリスト一覧を取得
  findWishlistsByUserId(userId: number): Promise<Wishlist[]>;

  // ユーザーが所有するウィッシュリストを取得（認可チェック用）
  findWishlistByIdAndUserId(
    wishlistId: number,
    userId: number,
  ): Promise<Wishlist | null>;

  // 公開ウィッシュリストを取得（認証不要、所有者のIDが必要）
  findPublicWishlistById(
    wishlistId: number,
    userId: number,
  ): Promise<Wishlist | null>;

  // 公開ウィッシュリストを取得（wishlistIdのみ、所有者のIDは不要）
  findPublicWishlistByIdOnly(wishlistId: number): Promise<Wishlist | null>;

  // ウィッシュリストを作成
  createWishlist(
    userId: number,
    name: string | null,
    isPublic: boolean,
  ): Promise<Wishlist>;

  // ウィッシュリストを更新
  updateWishlist(
    wishlistId: number,
    name: string | null | undefined,
    isPublic: boolean | undefined,
  ): Promise<Wishlist | null>;

  // ウィッシュリストを削除
  deleteWishlist(wishlistId: number): Promise<void>;

  // ウィッシュリスト内の商品一覧を取得（商品情報含む）
  findWishlistItemsByWishlistId(
    wishlistId: number,
  ): Promise<WishlistItemWithItem[]>;

  // ウィッシュリストに商品を追加
  addWishlistItem(wishlistId: number, itemId: number): Promise<WishlistItem>;

  // ウィッシュリストから商品を削除
  removeWishlistItem(wishlistId: number, itemId: number): Promise<void>;

  // ウィッシュリスト内に商品が既に存在するか確認
  existsWishlistItem(wishlistId: number, itemId: number): Promise<boolean>;
}
