export interface ICartItemRepository {
  upsert(cartId: number, itemId: number, amount: number): Promise<void>;
  delete(cartId: number, itemId: number): Promise<void>;
}
