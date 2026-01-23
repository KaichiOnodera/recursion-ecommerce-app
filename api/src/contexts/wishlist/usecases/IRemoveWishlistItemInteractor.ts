export interface IRemoveWishlistItemInteractor {
  execute(wishlistId: number, itemId: number, userId: number): Promise<void>;
}
