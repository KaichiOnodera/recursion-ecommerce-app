export interface ICartItemRepository {
  upsert(cartId: number, itemId: number, amount: number): Promise<void>;
}
