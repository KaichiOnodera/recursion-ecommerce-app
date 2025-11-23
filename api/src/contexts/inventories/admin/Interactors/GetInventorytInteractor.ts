import { IInventoryRepository } from "../../domains/repositories/IInventoryRepository";
import { Inventory } from "../../domains/entities/Inventory";

export class GetInventorytInteractor {
    constructor(private readonly inventoryRepository: IInventoryRepository) {};
    async  execute(itemId: number): Promise<Inventory | null> {
        return await this.inventoryRepository.findByItemId(itemId);
    }
}