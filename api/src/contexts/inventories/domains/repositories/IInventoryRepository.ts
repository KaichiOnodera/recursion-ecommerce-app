import { Inventory } from "../entities/Inventory";

export interface IInventoryRepository {
    findByItemId(itemId: number): Promise<Inventory | null>;
}