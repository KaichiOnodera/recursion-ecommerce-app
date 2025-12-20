export interface IInventoryRepository {
  decreaseStock(itemId: number, amount: number): Promise<void>;
}
