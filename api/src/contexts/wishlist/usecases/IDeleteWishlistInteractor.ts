export interface IDeleteWishlistInteractor {
  execute(wishlistId: number, userId: number): Promise<void>;
}
